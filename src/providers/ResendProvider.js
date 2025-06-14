/**lap_trinh_tich_hop_nang_cao_MERN_stack*/
const { Resend } = require('resend')
import { env } from '~/config/environment'

let resendInstance = new Resend(process.env.RESEND_API_KEY)

export const setResendInstance = (instance) => {
    resendInstance = instance
}

const sendMail = async (recipientMail, customSubject, htmlContent) => {
    try {
        const result = await resendInstance.emails.send({
            from: 'noreply@reniwdev.uk',
            to: recipientMail,
            subject: customSubject,
            html: htmlContent
        })
        console.log('Resend result:', result)
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

export const ResendProvider = {
    sendMail
}
