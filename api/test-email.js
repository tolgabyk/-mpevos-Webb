import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT) || 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const destination = process.env.JOIN_TEAM_EMAIL || process.env.CAREER_EMAIL || 'kariyer@impevos.com.tr'

  const envSummary = {
    SMTP_HOST: host || 'TANIMLANMAMIŞ (EKSİK)',
    SMTP_PORT: port,
    SMTP_USER: user ? `${user.slice(0, 3)}***@${user.split('@')[1] || ''}` : 'TANIMLANMAMIŞ (EKSİK)',
    SMTP_PASS_DURUMU: pass ? `Mevcut (${pass.length} karakter)` : 'TANIMLANMAMIŞ (EKSİK)',
    HEDEF_EPOSTA: destination,
  }

  if (!host || !user || !pass) {
    return res.status(400).json({
      ok: false,
      hata: 'Vercel ortamında gerekli SMTP değişkenleri eksik!',
      detay: envSummary,
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    })

    // 1. SMTP Bağlantı Doğrulama Testi
    await transporter.verify()

    // 2. Test e-postası gönder
    const info = await transporter.sendMail({
      from: `"İmpevos Test" <${user}>`,
      to: destination,
      subject: '✅ İmpevos SMTP Bağlantı Testi Başarılı',
      text: `Tebrikler! ${user} üzerinden ${destination} adresine e-posta gönderimi sorunsuz çalışıyor.`,
      html: `
        <div style="font-family:sans-serif;padding:20px;border:1px solid #10b981;border-radius:8px;">
          <h2 style="color:#059669;margin-top:0;">✅ SMTP Bağlantısı Başarılı</h2>
          <p>Tebrikler, bu e-posta Vercel üzerindeki SMTP yapılandırmasının çalıştığını doğrular.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
          <ul style="color:#4b5563;font-size:14px;line-height:1.6;">
            <li><b>Gönderen:</b> ${user}</li>
            <li><b>Alıcı:</b> ${destination}</li>
            <li><b>Host:</b> ${host}:${port}</li>
          </ul>
        </div>
      `,
    })

    return res.status(200).json({
      ok: true,
      mesaj: `Harika! Test e-postası başarıyla ${destination} adresine gönderildi.`,
      messageId: info.messageId,
      detay: envSummary,
    })
  } catch (err) {
    return res.status(500).json({
      ok: false,
      hata: 'SMTP sunucusu e-postayı reddetti veya bağlantı kurulamadı.',
      teknik_hata: err.message,
      hata_kodu: err.code || null,
      sunucu_yaniti: err.response || null,
      detay: envSummary,
    })
  }
}
