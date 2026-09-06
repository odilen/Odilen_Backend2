import nodemailer from 'nodemailer'

class MailService {
  createTransporter() {
    const mailPort = Number(process.env.MAIL_PORT)

    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: mailPort,
      secure: mailPort === 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })
  }

  async sendTicketConfirmation(
    userEmail,
    event,
    ticket
  ) {
    const transporter = this.createTransporter()

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: userEmail,
      subject: `Inscripción confirmada: ${event.title}`,
      text: `
Tu inscripción fue confirmada.

Evento: ${event.title}
Fecha: ${event.date}
Lugar: ${event.location}
Cantidad: ${ticket.quantity}
Código de reserva: ${ticket.reservationCode}
      `
    })
  }
}

export default new MailService()