// utils/mailTemplates/forgotPasswordTemplate.js

const forgotPasswordTemplate = ({
    APP_LOGO,
    confirmationLink,
    FORGOT_PASSWORD_TOKEN_LIFE,
    year
}) => {
    return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Forgot Password</title>
      </head>
      <body
        style="
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        "
      >
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table
                width="100%"
                bgcolor="#ffffff"
                cellpadding="30"
                cellspacing="0"
                style="margin: 0 auto; border-radius: 8px"
              >
                <tr>
                  <td align="center">
                    <img
                      src="${APP_LOGO}"
                      alt="Logo"
                      style="width: 300px; display: block; margin: 0 auto; height: 300px"
                    />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table
                width="600"
                bgcolor="#ffffff"
                cellpadding="30"
                cellspacing="0"
                style="margin: 20px auto; border-radius: 8px"
              >
                <tr>
                  <td>
                    <h2 style="color: #333">Reset Your Password</h2>
                    <p style="color: #555; font-size: 16px">
                      We received a request to reset your password. Click the button below to set a new one.
                    </p>
                    <p style="text-align: center; margin: 30px 0">
                      <a
                        href="${confirmationLink}"
                        style="
                          background-color: #000000;
                          color: #ffffff;
                          padding: 12px 24px;
                          text-decoration: none;
                          border-radius: 5px;
                          font-weight: bold;
                        "
                      >
                        Reset Password
                      </a>
                    </p>
                    <p style="color: #888; font-size: 14px">
                      If you didn’t request a password reset, you can safely ignore this email.
                    </p>
                    <p style="color: #888; font-size: 14px">
                      This link will expire in ${FORGOT_PASSWORD_TOKEN_LIFE} minutes.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="20">
          <tr>
            <td align="center" style="font-size: 12px; color: #aaa">
              &copy; ${year} Daily Sleep Tracker. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export default forgotPasswordTemplate
