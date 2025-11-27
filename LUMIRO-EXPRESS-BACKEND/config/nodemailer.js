const nodeMailer = require("nodemailer")

require('dotenv').config()  

// const transporter = nodeMailer.createTransport({
//     host : process.env.SMTP_HOST,
//     port : 587,
//     secure : false ,      // ONLY TRUE FOR 465
//     auth : {
//         user: process.env.SMTP_USER ,
//         pass : process.env.SMTP_PASS     
//     }
// })



// Create a test account 
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

module.exports = {transporter}