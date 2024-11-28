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

export function sendEmail(email: string, subject: string, text: string) {
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

export function sendReinitPasswordMail(email: string, token: string) {
  const subject = 'Réinitialisation de votre mot de passe'
  const text = `Bonjour, veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : https://digital-democracy.eu/change-password/?token=${token}&email=${email}`
  sendEmail(email, subject, text)
}

export function sendThankDonationMail(email: string, amount: number) {
  const subject = 'Merci pour votre don'
  const text = `Bonjour, nous vous remercions pour votre don de ${amount}€`
  sendEmail(email, subject, text)
}

//Moderation related emails

export function sendWarnMail(email: string, reason: string) {
  const subject = 'Avertissement'
  const text = `Bonjour, vous avez reçu un avertissement pour la raison suivante : ${reason}`
  sendEmail(email, subject, text)
}

//Notifications related emails

export function sendFollowUpdateMail(email: string, entityName: string) {
  const subject = 'Mise à jour d\'un sujet suivi'
  const text = `Bonjour, un sujet que vous suivez (${entityName}) a été mis à jour`
  sendEmail(email, subject, text)
}