// route cho việc quản lý người dùng

import express from 'express'
import { organizationController } from '~/controllers/organization/organizationController'

import isAuthorized, { hasRole } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { ROLE } from '~/utils/constants'

const Router = express.Router()

Router.route('/createNew').post(
    isAuthorized,
    hasRole(ROLE.MANAGER),
    multerUploadMiddleware.upload.single('logo'),
    organizationController.createNewOrganization
)
Router.route('/:organizationId/addStaff').post(
    isAuthorized,
    hasRole(ROLE.MANAGER),
    organizationController.addNewStaff
)
Router.route('/:organizationId/update').put(
    isAuthorized,
    hasRole(ROLE.MANAGER),
    organizationController.updateOrganization
)

export const organizationRoute = Router
