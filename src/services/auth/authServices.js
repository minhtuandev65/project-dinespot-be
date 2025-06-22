//  dịch vụ cho việc quản lý người dùng
import { StatusCodes } from 'http-status-codes'
import { authModel } from '~/models/auth/authModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { APP_LOGO, ROLE, WEBSITE_DOMAIN } from '~/utils/constants'
import { ResendProvider } from '~/providers/ResendProvider'
import dayjs from 'dayjs'
import ms from 'ms'
import verifyEmailTemplate from '~/template/auth/verifyEmailTemplate'
import forgotPasswordTemplate from '~/template/auth/forgotPasswordMailTemplate'
import passwordResetSuccessTemplate from '~/template/auth/resetPasswordSuccessTemplate'

const createNew = async (reqBody) => {
    const existingUser = await authModel.findByEmail(reqBody.email)

    const requestedRole =
        reqBody?.role === ROLE.ADMIN
            ? ROLE.ADMIN
            : reqBody?.role === ROLE.MANAGER
              ? ROLE.MANAGER
              : ROLE.USER

    if (existingUser) {
        if (existingUser.role?.includes(requestedRole)) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                'Email already exists with this role.'
            )
        }

        await authModel.pushNewRole(existingUser._id, requestedRole)
        const updatedUser = await authModel.findById(existingUser._id)
        return updatedUser
    }

    const nameFromEmail = reqBody.email.split('@')[0]

    const newUser = {
        email: reqBody.email,
        password: await bcrypt.hash(reqBody.password, 8),
        username: nameFromEmail,
        displayName: reqBody.displayName,
        verifyToken: uuidv4(),
        role: [requestedRole]
    }

    const createdUser = await authModel.createNew(newUser)
    const getNewUser = await authModel.findById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject =
        'Daily Sleep Tracker system: Please verify your email before using our services!'
    const htmlContent = verifyEmailTemplate({
        displayName: getNewUser.displayName,
        verificationLink: verificationLink
    })

    await ResendProvider.sendMail(getNewUser.email, customSubject, htmlContent)
    return getNewUser
}
const authenticate = async (reqBody) => {
    try {
        const existUser = await authModel.findByEmail(reqBody.email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (!existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your email or password is incorrect!'
            )
        }

        const userInfo = {
            _id: existUser._id,
            email: existUser.email,
            role: existUser.role
        }

        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE
        )
        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
            env.REFRESH_TOKEN_LIFE
        )
        await authModel.updateLatestActive(existUser._id)
        return { ...userInfo, accessToken, refreshToken }
    } catch (error) {
        throw Error(error)
    }
}
const refreshToken = async (clientRefreshToken) => {
    try {
        // Bước 01: Thực hiện giải mã token xem nó có hợp lệ hay là không
        const refreshTokenDecoded = await JwtProvider.verifyToken(
            clientRefreshToken,
            env.REFRESH_TOKEN_SECRET_SIGNATURE
        )
        // Đoạn này vì chúng ta chỉ lưu những thông tin unique và cố định của user trong token rồi, vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới.

        const userInfo = {
            _id: refreshTokenDecoded._id,
            email: refreshTokenDecoded.email,
            role: refreshTokenDecoded.role
        }

        // Buoc 02, Tao ra accessToken moi
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            // 5 giay
            env.ACCESS_TOKEN_LIFE
        )
        await authModel.updateLatestActive(refreshTokenDecoded._id)
        return {
            accessToken
        }
    } catch (error) {
        throw Error(error)
    }
}

const verifyAccount = async (reqBody) => {
    try {
        const existUser = await authModel.findByEmail(reqBody.email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        if (reqBody.token !== existUser.verifyToken) {
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token invalid')
        }
        const updatedData = {
            isActive: true,
            verifyToken: null
        }

        const updatedUser = await authModel.update(existUser._id, updatedData)

        return updatedUser
    } catch (error) {
        throw Error(error)
    }
}
const activateUser = async (userId) => {
    try {
        const existUser = await authModel.findById(userId)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        const updatedData = { isActive: true }
        let updatedUser = await authModel.update(existUser._id, updatedData)
        return updatedUser
    } catch (error) {
        throw Error(error)
    }
}
const forgotPassword = async (reqBody) => {
    try {
        const existUser = await authModel.findByEmail(reqBody.email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (!existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        const userInfo = {
            _id: existUser._id,
            email: existUser.email
        }

        const token = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.FORGOT_PASSWORD_TOKEN_LIFE
        )

        const confirmationLink = `${WEBSITE_DOMAIN}/account/resetPassword?token=${token}`

        await authModel.update(existUser._id, {
            resetPasswordToken: token,
            resetPasswordExpired: dayjs()
                .add(ms(env.FORGOT_PASSWORD_TOKEN_LIFE) + 10000, 'millisecond')
                .toDate()
        })

        const forgotPasswordMailTemplate = forgotPasswordTemplate({
            APP_LOGO: APP_LOGO,
            confirmationLink: confirmationLink,
            FORGOT_PASSWORD_TOKEN_LIFE: env.FORGOT_PASSWORD_TOKEN_LIFE,
            year: dayjs().year()
        })

        await ResendProvider.sendMail(
            existUser.email,
            'Forgot password confirmation email',
            forgotPasswordMailTemplate
        )
        return true
    } catch (error) {
        throw Error(error)
    }
}

const resetPassword = async (reqBody) => {
    try {
        const { token, newPassword } = reqBody

        const resetPasswordTokenDecoded = await JwtProvider.verifyToken(
            token,
            env.ACCESS_TOKEN_SECRET_SIGNATURE
        )

        const email = resetPasswordTokenDecoded.email
        const _id = resetPasswordTokenDecoded._id

        const userInfo = {
            _id,
            email
        }

        const existUser = await authModel.findByEmail(email)

        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

        if (!existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Your account is not active!'
            )

        if (
            existUser.resetPasswordToken !== token ||
            dayjs().isAfter(existUser.resetPasswordExpired)
        )
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Invalid token or reset password request expired'
            )

        const updatedUser = {
            password: await bcrypt.hash(newPassword, 8),
            resetPasswordToken: null,
            resetPasswordExpired: null
        }

        await authModel.update(existUser._id, updatedUser)
        const resetPasswordSuccessTemplate = passwordResetSuccessTemplate({
            username: existUser.username,
            loginUrl: `${WEBSITE_DOMAIN}/login`,
            year: dayjs().year(),
            APP_LOGO: APP_LOGO
        })
        await ResendProvider.sendMail(
            existUser.email,
            'Reset password success notification email',
            resetPasswordSuccessTemplate
        )

        return { ...userInfo }
    } catch (error) {
        throw Error(error)
    }
}
const getMyProfile = async (userId) => {
    try {
        const user = await authModel.getMyProfile(userId)

        return user
    } catch (error) {
        throw Error(error)
    }
}

export const userService = {
    createNew,
    authenticate,
    refreshToken,
    verifyAccount,
    activateUser,
    forgotPassword,
    resetPassword,
    getMyProfile
}
