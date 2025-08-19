import { v2 as cloudinary } from 'cloudinary'
import { env } from '~/config/environment'
import streamifier from 'streamifier'
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
})

const streamUpload = (fileBuffer, folderName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folderName },
            (err, result) => {
                if (err) reject(err)
                else resolve(result)
            }
        )

        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}

export const CloudStorageProvider = {
    streamUpload
}
