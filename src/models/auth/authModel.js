/**
    Model for user data.
 */
/**lap_trinh_tich_hop_nang_cao_MERN_stack*/

import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    PHONE_RULE
} from '~/validations/validators'
import { ObjectId } from 'mongodb'
import { GENDER, ROLE } from '~/utils/constants'
import { env } from '~/config/environment'

export const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string()
        .required()
        .pattern(EMAIL_RULE)
        .message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required(),
    // username cắt ra từ email sẽ có khả năng không unique bởi vì sẽ có những tên email trùng nhau nhưng từ các nhà cung cấp khác nhau
    username: Joi.string().required().trim().strict(),
    displayName: Joi.string().required().trim().strict(),
    role: Joi.string()
        .valid(...Object.values(ROLE))
        .default(ROLE.USER),
    phone: Joi.string().pattern(PHONE_RULE).label('Contact Phone'),
    avatar: Joi.string().default(env.DEFAULT_AVATAR),
    gender: Joi.string()
        .valid(...Object.values(GENDER))
        .default(GENDER.MALE),
    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    latestActiveAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, {
        abortEarly: false
    })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const createUser = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .insertOne(validData)
        return createUser
    } catch (error) {
        throw new Error(error)
    }
}

const findByEmail = async (emailValue) => {
    try {
        const exist = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ email: emailValue })

        return exist
    } catch (error) {
        throw new Error(error)
    }
}
const findById = async (id) => {
    try {
        const user = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

        return user
    } catch (error) {
        throw new Error(error)
    }
}
const pushNewRole = async (userId, role) => {
    try {
        return await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .updateOne(
                {
                    _id: new ObjectId(userId)
                },
                {
                    $set: { role: role }
                }
            )
    } catch (error) {
        throw new Error(error)
    }
}
const getMyProfile = async (id) => {
    try {
        const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ]
        const user = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .aggregate(pipeline)
            .toArray()

        return user
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (userId, updatedData) => {
    try {
        Object.keys(updatedData).forEach((fieldName) => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updatedData[fieldName]
            }
        })
        const result = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: { ...updatedData, updatedAt: new Date() } },
                { returnDocument: 'after' }
            )

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const updateLatestActive = async (userId) => {
    try {
        const result = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        latestActiveAt: new Date()
                    }
                }
            )

        return result
    } catch (error) {
        throw new Error(error)
    }
}

export const authModel = {
    findByEmail,
    createNew,
    update,
    findById,
    pushNewRole,
    updateLatestActive,
    getMyProfile
}
