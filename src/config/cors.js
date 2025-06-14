import { WEBSITE_DOMAIN } from '~/utils/constants'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

export const corsOptions = {
    origin: function (origin, callback) {
        // Nếu môi trường là local dev thì cho qua luôn
        if (env.BUILD_MODE === 'dev') {
            return callback(null, true)
        }

        console.log(WEBSITE_DOMAIN)
        // Ngược lại thì hiện tại code chúng ta đang làm còn 1 trường hợp là:
        // env.BUILD_MODE === 'production'

        // Kiểm tra xem origin có phải là domain được chấp nhận hay không
        if (WEBSITE_DOMAIN.includes(origin)) {
            return callback(null, true)
        }

        // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
        return callback(
            new ApiError(
                StatusCodes.FORBIDDEN,
                `${origin} not allowed by our CORS Policy.`
            )
        )
    },

    // Some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,

    // CORS sẽ cho phép nhận cookies từ request
    credentials: true
}
