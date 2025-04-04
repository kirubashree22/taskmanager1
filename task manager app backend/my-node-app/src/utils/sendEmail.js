const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,     // Mailtrap host
    port: process.env.EMAIL_PORT,     // Mailtrap port
    auth: {
      user: process.env.EMAIL_USER,   // Mailtrap username
      pass: process.env.EMAIL_PASS,   // Mailtrap password
    },
  });

  await transporter.sendMail({
    from: '"Support" <no-reply@example.com>', 
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
