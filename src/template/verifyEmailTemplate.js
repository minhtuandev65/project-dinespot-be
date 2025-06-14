// utils/mailTemplates/verifyEmailTemplate.js

const verifyEmailTemplate = ({ displayName, verificationLink }) => {
    return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #333333;
          }
          p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 12px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #999999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to DineSpot!</h2>
          <p>Hi ${displayName},</p>
          <p>
            Thank you for creating an account with us. Please confirm your
            email address by clicking the button below:
          </p>
          <a href="${verificationLink}" class="button">Verify Your Email</a>
          <p>
            If the button doesn't work, copy and paste this URL into your
            browser:
          </p>
          <p style="word-break: break-all">
            <a href="${verificationLink}">${verificationLink}</a>
          </p>
          <div class="footer">
            <p>
              If you didn’t create this account, you can safely ignore
              this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

export default verifyEmailTemplate
