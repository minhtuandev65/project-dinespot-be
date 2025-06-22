const organizationUpdateTemplate = ({ email, name, isOwner }) => {
    return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Organization Update Notification</title>
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
            color: ${isOwner ? '#2e7d32' : '#c62828'};
          }
          p {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #999999;
            text-align: center;
          }
          .highlight {
            font-weight: bold;
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${isOwner ? 'Your Organization Has Been Updated' : 'Organization Update Attempt Detected'}</h2>
          <p>Hi ${email},</p>

          ${
              isOwner
                  ? `<p>The information of your organization <span class="highlight">${name}</span> has been successfully updated.</p>
                 <p>If you didn’t make this change, please contact our support immediately.</p>`
                  : `<p>Someone has attempted to update the organization <span class="highlight">${name}</span>, but they are not the registered owner.</p>
                 <p>If this is a mistake or you believe your organization’s information has been modified without your permission, please contact our admin team at <a href="mailto:admin@dinespot.com">admin@dinespot.com</a>.</p>`
          }

          <div class="footer">
            <p>Thank you for using our platform.<br/>— The DineSpot Team —</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export default organizationUpdateTemplate
