/**project-dinespot*/
import express from 'express'
import { authRoute } from './authRoute'

const Router = express.Router()

Router.get('/health', (req, res) => {
    res.json({
        message: 'Ready to use.'
    })
})

Router.use('/api/users', authRoute)

export const APIs_v1 = Router
