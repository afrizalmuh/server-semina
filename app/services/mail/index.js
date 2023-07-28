// cwlzvlxcmfdqzakx => securesally
const nodemailer = require('nodemailer')
const mustache = require('mustache')
const fs = require('fs')
const { gmail, password } = require('../../config')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: gmail,
    pass: password
  }
})

const otpMail = async (email, data) => {
  try {
    let template = fs.readFileSync('app/views/email/otp.html', 'utf8');
    let message = {
      from: 'testersendmail01@gmail.com',
      to: email,
      subject: 'OTP for registration is: ',
      html: mustache.render(template, data)
    }

    return await transporter.sendMail(message)
  } catch (ex) {
    console.log(ex)
  }
}

const eticketingMail = async (email, data) => {
  try {
    let template = fs.readFileSync('app/views/email/invoice.html', 'utf8');
    let message = {
      from: 'testersendmail01@gmail.com',
      to: email,
      subject: 'Invoice',
      html: mustache.render(template, data)
    }

    return await transporter.sendMail(message)
  } catch (ex) {
    console.log(ex)
  }
}

module.exports = { otpMail, eticketingMail }