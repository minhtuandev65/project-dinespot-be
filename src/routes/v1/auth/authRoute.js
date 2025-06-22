// route cho việc quản lý người dùng

import express from 'express'
import { authController } from '~/controllers/auth/authController'
import isAuthorized from '~/middlewares/authMiddleware'

const Router = express.Router()

// Router xác thực dăng nhập của người dùng
Router.route('/login').post(authController.authenticate)
Router.route('/getMyProfile').get(isAuthorized, authController.getMyProfile)
// Router dang ký tài khoản mới
Router.route('/register').post(authController.createNew)

// Router cho việc đăng xuất người dùng
Router.route('/logout').post(authController.logout)

Router.route('/refresh_token').get(authController.refreshToken)

Router.route('/verifyEmail').post(authController.verifyAccount)

Router.route('/forgotPassword').post(authController.forgotPassword)

Router.route('/resetPassword').post(authController.resetPassword)

export const authRoute = Router
