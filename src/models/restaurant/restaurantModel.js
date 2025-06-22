import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import {
    OBJECT_ID_RULE,
    OBJECT_ID_RULE_MESSAGE,
    PHONE_RULE
} from '~/validations/validators'

export const RESTAURANT_COLLECTION_NAME = 'restaurants'
const RESTAURANT_COLLECTION_SCHEMA = Joi.object({
    organizationId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    revenueId: Joi.string()
        .required()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
    name: Joi.string().required().min(3).max(100).label('Restaurant name'),
    email: Joi.string().email().optional().label('Contact email'),
    logoURL: Joi.string().uri().optional().label('URL logo'),
    phone: Joi.string().required().pattern(PHONE_RULE).label('Contact phone'),
    categories: Joi.array()
        .items(Joi.string())
        .optional()
        .label('Category dish'),
    address: Joi.string().required().max(200).label('Address'),
    description: Joi.string().max(500).optional().label('Desciption'),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
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
    return await RESTAURANT_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false
    })
}
const createNewRestaurant = async (newRestaurant) => {
    try {
        const valiData = await validateBeforeCreate(newRestaurant)
        const dataToInsert = {
            ...valiData,
            organizationId: new ObjectId(valiData.organizationId)
        }
        const exist = GET_DB()
            .collection(RESTAURANT_COLLECTION_NAME)
            .insertOne(dataToInsert)
        return exist
    } catch (error) {
        throw new Error(error)
    }
}
const updateRestaurant = async ({ restaurantId, newUpdateData }) => {
    try {
        Object.keys(newUpdateData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete newUpdateData[fieldName]
            }
        })
        const exist = GET_DB()
            .collection(RESTAURANT_COLLECTION_NAME)
            .findOneAndUpdate(
                {
                    _id: new ObjectId(restaurantId),
                    _destroy: false
                },
                { $set: { ...newUpdateData, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )
        return exist
    } catch (error) {
        throw new Error(error)
    }
}
const findRestaurantById = async (restaurantId) => {
    try {
        const exist = GET_DB()
            .collection(RESTAURANT_COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(restaurantId)
            })
        return exist
    } catch (error) {
        throw new Error(error)
    }
}

export const restaurantModel = {
    findRestaurantById,
    createNewRestaurant,
    updateRestaurant
}
