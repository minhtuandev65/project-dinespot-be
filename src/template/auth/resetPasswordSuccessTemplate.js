// utils/mailTemplates/passwordResetSuccessTemplate.js

const passwordResetSuccessTemplate = ({
    APP_LOGO,
    username,
    loginUrl,
    year
}) => {
    return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset Successful</title>
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

        <!-- Main Content -->
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
                    <h2 style="color: #333">Your Password Has Been Changed</h2>
                    <p style="color: #555; font-size: 16px">Hi ${username},</p>
                    <p style="color: #555; font-size: 16px">
                      We’re just letting you know that your password was successfully reset.
                      If this was you, there’s nothing more to do.
                    </p>
                    <p style="color: #555; font-size: 16px">
                      If you did not perform this action, please contact our support
                      immediately to secure your account.
                    </p>
                    <p style="margin-top: 30px">
                      <a
                        href="${loginUrl}"
                        style="
                          background-color: #000000;
                          color: #ffffff;
                          padding: 12px 24px;
                          text-decoration: none;
                          border-radius: 5px;
                          font-weight: bold;
                        "
                      >
                        Log In
                      </a>
                    </p>
                    <p style="color: #888; font-size: 14px">
                      Thanks,<br />The Daily Sleep Tracker Team
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

export default passwordResetSuccessTemplate
