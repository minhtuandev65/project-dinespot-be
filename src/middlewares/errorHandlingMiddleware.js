import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

export const errorHandlingMiddleware = (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
        stack: err.stack
    }

    console.log(env.BUILD_MODE)
    if (env.BUILD_MODE !== 'dev') delete responseError.stack

    // Trả responseError về phía Front-end
    res.status(responseError.statusCode).json(responseError)
}
