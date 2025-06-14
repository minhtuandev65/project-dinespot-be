const { env } = require('./environment')

const { MongoClient, ServerApiVersion } = require('mongodb')

let jobSeekDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true
    },
    autoSelectFamily: false
})

export const CONNECT_DB = async () => {
    await mongoClientInstance.connect()

    jobSeekDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
    // Tạo text index cho full-text search
    await jobSeekDatabaseInstance.collection('sleepTrackers').createIndex(
        {
            title: 'text',
            description: 'text',
            location: 'text'
        },
        {
            name: 'TextIndexForSearch'
        }
    )
}

export const CLOSE_DB = async () => {
    await mongoClientInstance.close()
}

export const GET_DB = () => {
    if (!jobSeekDatabaseInstance)
        throw new Error('Must connect to mongodb first.')

    return jobSeekDatabaseInstance
}
