/**
 *
 *
 *
 * "Nơi lưu trữ các trạng thái, hằng số, biến toàn cục dùng chung trong ứng dụng"
 */

import { env } from '~/config/environment'

export const WEBSITE_DOMAIN =
    env.BUILD_MODE === 'production'
        ? env.WEBSITE_DOMAIN_PRODUCTION
        : env.WEBSITE_DOMAIN_DEVELOPMENT
export const APP_LOGO =
    'https://res.cloudinary.com/dyp1giiye/image/upload/v1749895786/main-logo_nwyrai.png'
export const ROLE = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    MANAGER: 'MANAGER',
    STAFF: 'STAFF'
}
export const GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE'
}
export const ORGIZATION_STATUS = {
    ACCEPTED: 'ACCEPTED',
    PENDING: 'PENDING',
    REJECTED: 'REJECTED'
}