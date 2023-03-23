const nodemailer = require('nodemailer');

require('dotenv').config();

const { META_HOST, META_PORT, META_PASS, } = process.env;

const nodemailerConfig = {
  host: META_HOST,
  port: META_PORT,
  secure: true,
  auth: {
    user: 'svitlana_plotnikova@meta.ua',
    pass: META_PASS,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async data => {
    const email = { ...data, from: 'svitlana_plotnikova@meta.ua' };
    await transporter.sendMail(email);
    return true;
} 

module.exports = sendEmail;
