const nodemailer = require('nodemailer');
const config = require('./config/keys');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 587,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD
    }, 
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = (email, subject, html) => {
    transporter.sendMail({
        from: config.EMAIL, //put your gmail account here!!!
        to: email,
        subject: subject,
        html: html,
    })
}

module.exports = sendEmail;