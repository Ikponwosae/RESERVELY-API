require('dotenv').config()
const path = require('path')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const hbs = require('nodemailer-express-handlebars')

let transporter = nodemailer.createTransport(smtpTransport({
  service: process.env.EMAIL_CLIENT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
}))

const verifyAccount = async(recipient, name, url) => {
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views')
  }

  transporter.use('compile', hbs(handlebarOptions))

  const options = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "Verify Your Account",
    template: "confirmAcc",
    context: {
      name: name,
      confirmURL: url,
    }
  }

  try {
    transporter.sendMail(options, (info) => {
      console.log(info)
    })
  } catch (error) {
    console.log(error)
  }
}

const staffOnboard = async(recipient, name, url, boss, bossmail) => {
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views')
  }

  transporter.use('compile', hbs(handlebarOptions))

  const options = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "Employee Invite",
    template: "staffInvite",
    context: {
      name: name,
      confirmURL: url,
      bossmail: bossmail,
      bossName: boss
    }
  }

  try {
    transporter.sendMail(options, (info) => {
      console.log(info)
    })
  } catch (error) {
    console.log(error)
  }
}

const createAppointmentEmail = async(recipient, name, business, service) => {
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views')
  }

  transporter.use('compile', hbs(handlebarOptions))

  const options = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "Appointment Created",
    template: "createAppointment",
    context: {
      name: name,
      businessName : business,
      serviceName : service
    }
  }

  try {
    transporter.sendMail(options, (info) => {
      console.log(info)
    })
  } catch (error) {
    console.log(error)
  }
}

const approvedAppointmentUserEmail = async(recipient, name, staff, day, time, business, service) => {
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views')
  }

  transporter.use('compile', hbs(handlebarOptions))

  const options = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "Appointment Approved",
    template: "approvedAppointmentUser",
    context: {
      name: name,
      staff: staff,
      day: day,
      time: time,
      businessName : business,
      serviceName : service
    }
  }

  try {
    transporter.sendMail(options, (info) => {
      console.log(info)
    })
  } catch (error) {
    console.log(error)
  }
}

const scheduleAppointmentStaffEmail = async(recipient, name, customer, day, time) => {
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views')
  }

  transporter.use('compile', hbs(handlebarOptions))

  const options = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "Appointment Scheduled",
    template: "scheduleAppointmentStaff",
    context: {
      customer: customer,
      name: name,
      day: day,
      time: time
    }
  }

  try {
    transporter.sendMail(options, (info) => {
      console.log(info)
    })
  } catch (error) {
    console.log(error)
  }
}

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'botak41761@laserlip.com', // Change to your recipient
//   from: 'reply.reservely@outlook.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

module.exports = {
  verifyAccount,
  staffOnboard,
  createAppointmentEmail,
  approvedAppointmentUserEmail,
  scheduleAppointmentStaffEmail
}