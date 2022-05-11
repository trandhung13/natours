const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome()

module.exports = class Email {
  constructor(user, url) {
    this.from = `Tran Duc Hung <${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // send('welcome', 'Welcome to the Natours Family')
  async send(template, subject) {
    // 1) Render html based on a pug file
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firtName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create transport and send mail
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
