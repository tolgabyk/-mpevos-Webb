import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Ad, E-posta ve Mesaj alanları zorunludur.' })
  }

  try {
    // Nodemailer SMTP konfigürasyonu
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // 465 için true, diğerleri için false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL || 'impevos@gmail.com',
      subject: subject || 'Web Sitesi İletişim Formu Yeni Mesaj',
      text: `Gönderen: ${name} (${email})\n\nMesaj:\n${message}`,
      html: `
        <h3>Web Sitesinden Yeni İletişim Formu Mesajı</h3>
        <p><strong>Gönderen:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject || 'Belirtilmedi'}</p>
        <hr/>
        <h4>Mesaj:</h4>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    }

    // E-posta gönderimi (Eğer .env değerleri yoksa simüle et)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions)
      console.log('E-posta başarıyla gönderildi.')
    } else {
      console.log('--- SMTP AYARLARI EKSİK ---')
      console.log('E-posta simüle edildi:')
      console.log(mailOptions)
      // Simülasyon için bekleme (UI loader test etmek için)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    res.status(200).json({ success: true, message: 'Mesajınız ulaştı.' })

  } catch (error) {
    console.error('E-posta gönderim hatası:', error)
    res.status(500).json({ success: false, error: 'Sunucu tarafında bir hata oluştu.' })
  }
})

export default router
