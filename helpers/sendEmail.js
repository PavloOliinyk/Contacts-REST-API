/* eslint-disable no-useless-catch */
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async data => {
  const emailSender = 'oliinyk.pavlo@gmail.com';
  try {
    const email = { ...data, from: emailSender };
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
