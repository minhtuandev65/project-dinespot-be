import JWT from 'jsonwebtoken'

const generateToken = async (userInfo, secretKey, expireTime) => {
    try {
        const token = JWT.sign(userInfo, secretKey, {
            algorithm: 'HS256',
            expiresIn: expireTime
        })

        return token
    } catch (error) {
        throw new Error(error)
    }
}

const verifyToken = async (token, secretKey) => {
    try {
        return JWT.verify(token, secretKey)
    } catch (error) {
        throw new Error(error)
    }
}

export const JwtProvider = {
    generateToken,
    verifyToken
}
