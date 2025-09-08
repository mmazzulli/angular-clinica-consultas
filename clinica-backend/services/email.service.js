const nodemailer = require('nodemailer');

// Configuração do transporter usando SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 2525),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envia um email usando o transporter configurado
 * @param {string} to - email do destinatário
 * @param {string} subject - assunto do email
 * @param {string} html - conteúdo em HTML do email
 * @returns {Promise}
 */
async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("📧 Email enviado:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Erro ao enviar email:", err);
    throw new Error("Falha ao enviar email");
  }
}

module.exports = { sendEmail };
