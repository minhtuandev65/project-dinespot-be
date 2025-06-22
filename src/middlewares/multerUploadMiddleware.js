import multer from 'multer'
import {
    ALLOW_COMMON_FILE_TYPES,
    LIMIT_COMMON_FILE_SIZE
} from '~/validations/validators'

const customFilter = (req, file, callback) => {
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
        const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'

        return callback(errMessage, null)
    }

    return callback(null, true)
}

const upload = multer({
    limits: {
        freeSize: LIMIT_COMMON_FILE_SIZE
    },
    fileFilter: customFilter
})

export const multerUploadMiddleware = { upload }
