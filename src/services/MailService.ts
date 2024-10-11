import nodemailer from 'nodemailer'

const emailAdress = process.env.EMAIL_ADRESS
const emailPassCode = process.env.EMAIL_PASS_CODE

const transporter = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true,
  auth: {
    user: emailAdress,
    pass: emailPassCode
  }
})

function sendEmail(email: string, subject: string, text: string) {
  const mailOptions = {
    from: emailAdress,
    to: email,
    subject: subject,
    text: text
  }

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

function sendReinitPasswordMail(email: string, token: string) {
  const subject = 'Réinitialisation de votre mot de passe'
  const text = `Bonjour, veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : https://digital-democracy.eu/change-password/?token=${token}&email=${email}`
  sendEmail(email, subject, text)
}

function sendThankDonationMail(email: string, amount: number) {
  const subject = 'Merci pour votre don'
  const text = `Bonjour, nous vous remercions pour votre don de ${amount}€`
  sendEmail(email, subject, text)
}

export { sendEmail, sendReinitPasswordMail, sendThankDonationMail }
