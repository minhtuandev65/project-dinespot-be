/**project-dinespot*/
import express from 'express'
import { authRoute } from './auth/authRoute'
import { organizationRoute } from './organization/organizationRoute'

const Router = express.Router()

Router.get('/health', (req, res) => {
    res.json({
        message: 'Ready to use.'
    })
})

Router.use('/api/users', authRoute)
Router.use('/api/organization', organizationRoute)

export const APIs_v1 = Router
