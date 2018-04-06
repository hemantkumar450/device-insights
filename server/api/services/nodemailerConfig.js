let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'deviceinsights2017@gmail.com',
    pass: 'deviceinsight'
  }
});

let mailOptions = {
  from: 'deviceinsights2017@gmail.com',
  to: '',
  subject: '',
  text: '',
  html: ''
};

let nodemailerConfig = {};

nodemailerConfig.getEmailCredentials = () => {
  return transporter;
}

nodemailerConfig.getMailOptions = () => {
  return mailOptions;
}

module.exports = nodemailerConfig;
