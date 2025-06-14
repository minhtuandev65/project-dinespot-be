import express from 'express'
import cookieParser from 'cookie-parser'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { APIs_v1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { env } from './config/environment'
import { corsOptions } from './config/cors'

const START_SERVER = () => {
    const app = express()

    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store')
        next()
    })

    app.use(cookieParser())

    app.use(express.json())
    app.use(cors(corsOptions))

    app.use('/v1', APIs_v1)

    app.use(errorHandlingMiddleware)

    if (env.BUILD_MODE === 'production') {
        app.listen(process.env.PORT, () => {
            console.log(
                `3. Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at  Port: ${process.env.PORT}`
            )
        })
    } else {
        app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
            console.log(
                `3. Local DEV: Hi ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`
            )
        })
    }

    exitHook(() => {
        console.log('4. Server is shutting down...')
        CLOSE_DB()
        console.log('5. Disconnected from MongoDB Cloud Atlas')
    })
}

;(async () => {
    try {
        console.log('1. Connecting to MongoDB Cloud Atlas...')

        await CONNECT_DB()

        console.log('2. Connected to MongoDB Cloud Atlas!')

        START_SERVER()
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
})()
