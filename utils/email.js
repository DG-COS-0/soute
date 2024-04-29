const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `GNANVO Deo Gratias ${process.env.EMAIL_SENDER} `;
  }

  createTransporter() {
    if (process.env.NODE_ENV === "production") {
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }
  async sendMail(pugFile, subject) {
    const emailBody = pug.renderFile(
      `${__dirname}/../template/${pugFile}.pug`,
      { firstName: this.firstName, url: this.url, subject }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: htmlToText.fromString(html),
      html: emailBody,
    };
    this.createTransporter();
    await transporter.sendEmail(mailOptions);
  }
  async sendWelcomeEmail() {
    await this.sendMail(
      "welcome",
      "Nous vous souhaitons la Bienvenue chez RONEFYX 😊."
    );
  }
  async sendPasswordResetEmail() {
    await this.sendMail(
      "Token de recuperation de mot de passe",
      "Votre token de reinitialisation de mot de passe"
    );
  }
}
module.exports = Email;
