const organizationCreateNewTemplate = ({ email, name }) => {
    return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Organization Form Submitted</title>
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
          <h2>Organization Form Submitted Successfully</h2>
          <p>Hi ${email},</p>
          <p>
            Thank you for submitting the organization creation form for <strong>${name}</strong>.
          </p>
          <p>
            Our team has received your information and is currently reviewing your request. Once approved, you'll be notified and will be able to manage your organization's profile and job postings on our platform.
          </p>
          <p>
            If you have any questions during this process, feel free to reach out to our support team at any time.
          </p>
          <div class="footer">
            <p>Thank you for choosing our platform.<br/>— The DineSpot Team —</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export default organizationCreateNewTemplate
