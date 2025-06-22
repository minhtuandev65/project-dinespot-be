import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { ORGIZATION_STATUS } from '~/utils/constants'
import {
    OBJECT_ID_RULE,
    OBJECT_ID_RULE_MESSAGE,
    PHONE_RULE
} from '~/validations/validators'

export const ORG_COLLECTION_NAME = 'organization'
const ORG_COLLECTION_SCHEMA = Joi.object({
    ownerId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    name: Joi.string().required().min(3).max(100).label('Orgization name'),
    description: Joi.string().max(500).optional().label('Desciption'),
    logoURL: Joi.string().uri().optional().label('URL logo'),
    email: Joi.string().email().optional().label('Contact email'),
    phone: Joi.string().required().pattern(PHONE_RULE).label('Contact phone'),
    address: Joi.string().required().max(200).label('Address'),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    status: Joi.string()
        .valid(
            ORGIZATION_STATUS.ACCEPTED,
            ORGIZATION_STATUS.PENDING,
            ORGIZATION_STATUS.REJECTED
        )
        .default(ORGIZATION_STATUS.PENDING)
        .label('Status'),
    isActive: Joi.boolean().default(false),
    createdAt: Joi.date()
        .timestamp('javascript')
        .default(Date.now)
        .label('Created day'),
    updatedAt: Joi.date()
        .timestamp('javascript')
        .default(null)
        .label('Updated day'),
    _destroy: Joi.boolean().default(false).label('Destroy')
})
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'ownerId', 'createdAt']
const validateBeforeCreate = async (data) => {
    return await ORG_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false
    })
}
// Tạo mới tổ chức
const createNewOrganization = async (newOrganization) => {
    try {
        const validData = await validateBeforeCreate(newOrganization)
        const dataToInsert = {
            ...validData,
            ownerId: new ObjectId(validData.ownerId)
        }
        const exist = GET_DB()
            .collection(ORG_COLLECTION_NAME)
            .insertOne(dataToInsert)
        return exist
    } catch (error) {
        throw new Error(error)
    }
}
const findOrganizationById = async (organizationId) => {
    try {
        const exist = GET_DB()
            .collection(ORG_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(organizationId) })
        return exist
    } catch (error) {
        throw new Error(error)
    }
}
const updateOrganization = async ({ organizationId, newUpdateData }) => {
    try {
        Object.keys(newUpdateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete newUpdateData[fieldName]
            }
        })
        const exist = await GET_DB()
            .collection(ORG_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(organizationId), _destroy: false },
                { $set: { ...newUpdateData, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return exist
    } catch (error) {
        throw new Error(error)
    }
}
export const organizationModel = {
    findOrganizationById,
    createNewOrganization,
    updateOrganization
}
