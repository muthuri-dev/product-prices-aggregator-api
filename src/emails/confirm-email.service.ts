import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfirmEmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.getOrThrow<string>('SENDER_SUPPORT_EMAIL'),
        pass: this.configService.getOrThrow<string>('SENDER_EMAIL_PASSWORD'),
      },
    });
  }

  async sendConfirmationEmail(
    email: string,
    confirmation_token: string,
    username: string,
  ) {
    const mailOptions = {
      from: this.configService.getOrThrow<string>('SENDER_SUPPORT_EMAIL'),
      to: email,
      subject:
        ' Welcome to price Aggregator - Please Verify Your Email Address to use our API',
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to GraphIt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 150px;
        }
        .content {
            text-align: center;
            color: #333333;
        }
        .content h1 {
            font-size: 24px;
            color: #e74c3c;
            margin-bottom: 10px;
        }
         .content h2 {
            font-size: 20px;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
            color: #333333;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button-container a {
            background-color: #e74c3c;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
        }
        .footer a {
            color: #e74c3c;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="content">
            <h1>Welcome to Price Aggregator, ${username}</h1>
            <p>We’re excited to have you on board. Before you can start using the API, please confirm your email address by clicking the button below.</p>
        </div>
        <div class="button-container">
            <a href="${confirmation_token}">Confirm Your Email</a>
        </div>
        <div class="content">
        <h2>Or copy this token if you are using API playground </h2>
        <br><code>${confirmation_token}</code>
        </div>
        <div class="content">
            <p>If you did not sign up for price Aggregator, please ignore this email or contact our support team.</p>
            <p>Thank you,<br>The Price Aggregator Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Product price Aggregator. All rights reserved.</p>
        </div>
    </div>

</body>
</html>

      `,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent successfully');
    } catch (error) {
      throw new Error(`Failed to send confirmation email: ${error} `);
    }
  }
}
