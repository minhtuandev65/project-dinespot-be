import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { authModel } from '~/models/auth/authModel'
import {
    ORG_COLLECTION_NAME,
    organizationModel
} from '~/models/organization/organizationModel'
import { CloudStorageProvider } from '~/providers/CloudStorageProvider'
import { geocodeAddress } from '~/providers/geocodeAddress'
import { ResendProvider } from '~/providers/ResendProvider'
import organizationCreateNewTemplate from '~/template/organization/organizationCreateNewTemplate'
import organizationUpdateTemplate from '~/template/organization/organizationUpdateTemplate'
import ApiError from '~/utils/ApiError'
import { ROLE } from '~/utils/constants'

const createNewOrganization = async (newOrganizationData) => {
    try {
        const { ownerId, address, name, logoURL } = newOrganizationData
        const existUser = await authModel.findById(ownerId)
        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
        if (!existUser.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Please active your account!'
            )

        const email = existUser.email
        const { lat, lng } = await geocodeAddress(address)

        let newOrganization = {
            ...newOrganizationData,
            email,
            name,
            lat,
            lng,
            ownerId
        }

        if (logoURL) {
            const uploadResult = await CloudStorageProvider.streamUpload(
                logoURL.buffer,
                ORG_COLLECTION_NAME
            )
            newOrganization = {
                ...newOrganization,
                logoURL: uploadResult.secure_url
            }
        }

        const result =
            await organizationModel.createNewOrganization(newOrganization)

        const organizationCreateMailTemplate = organizationCreateNewTemplate({
            email,
            name
        })

        ResendProvider.sendMail(
            email,
            'Organization Registration Successful',
            organizationCreateMailTemplate
        )

        return { _id: result.insertedId, ...newOrganization }
    } catch (error) {
        throw Error(error)
    }
}
const updateOrganization = async ({ userId, organizationData }) => {
    try {
        const { address, organizationId, logoURL } = organizationData
        const existOrganization =
            await organizationModel.findOrganizationById(organizationId)
        if (!existOrganization)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Organization not found!')

        if (!existOrganization.isActive)
            throw new ApiError(
                StatusCodes.NOT_ACCEPTABLE,
                'Please wait for the administrator to approve the organization.'
            )
        const { email, name } = existOrganization
        const isOwner = new ObjectId(userId).equals(existOrganization.ownerId)
        let newUpdateData = {
            ...(organizationData || {})
        }

        if (address) {
            const { lat, lng } = await geocodeAddress(address)
            newUpdateData.lat = lat
            newUpdateData.lng = lng
        }
        if (logoURL) {
            const uploadResult = await CloudStorageProvider.streamUpload(
                logoURL.buffer,
                ORG_COLLECTION_NAME
            )
            newUpdateData.logoURL = uploadResult.secure_url
        }
        const result = await organizationModel.updateOrganization({
            organizationId,
            newUpdateData
        })
        const organizationUpdateMailTemplate = organizationUpdateTemplate({
            email,
            name,
            isOwner
        })
        ResendProvider.sendMail(
            email,
            'Organization Update Notification',
            organizationUpdateMailTemplate
        )
        return result
    } catch (error) {
        throw Error(error)
    }
}
const addNewStaff = async (addNewStaff) => {
    try {
        const { organizationId, emailValue } = addNewStaff
        const existUser = await authModel.findByEmail(emailValue.email)
        if (!existUser)
            throw new ApiError(StatusCodes.NOT_FOUND, 'Email not found!')
        if (!existUser.email)
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email not activate')
        const userId = existUser._id
        await authModel.pushNewRole(userId, ROLE.STAFF)
        console.log('userId', userId)
        console.log('orgId', organizationId)
        const result = await organizationModel.createNewStaffOrganization({
            userId,
            organizationId
        })
        return result
    } catch (error) {
        throw Error(error)
    }
}
export const organizationServices = {
    createNewOrganization,
    updateOrganization,
    addNewStaff
}
