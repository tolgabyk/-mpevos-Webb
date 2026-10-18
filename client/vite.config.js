import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const PAGES = {
  '/': {
    title: 'IMPEVOS | Yapay Zeka ve Yazılım Çözümleri',
    description: 'IMPEVOS A.Ş., yapay zeka destekli ürünler geliştirir ve işletmelerin süreçlerini otomatikleştirir. Not Ortağım, İnffy ve Awyron AI.',
    body: `
      <h1>Fikirden geleceğe</h1>
      <p>Kurumsal yazılım, mobil uygulama ve süreç otomasyonu alanında ölçeklenebilir çözümler geliştiren İstanbul merkezli bir teknoloji şirketiyiz.</p>
      <h2>Biz Kimiz</h2>
      <p>IMPEVOS Teknoloji A.Ş., 2026 yılında İstanbul'da kuruldu. Kendi dijital ürünlerimizi geliştiriyor, işletmelere yazılım ve yapay zeka çözümleri sunuyoruz. Ürün geliştirme, kurumsal yazılım, yapay zeka entegrasyonu ve süreç otomasyonu alanlarında çalışıyoruz.</p>
      <h2>Ürünler</h2>
      <ul>
        <li>Not Ortağım — Öğrenciler için yapay zeka destekli not ve çalışma asistanı. App Store ve Google Play'de yayında.</li>
        <li>İnffy — İçerik üreticileri için anlaşma, içerik, finans ve AI araçlarını tek yerde toplayan Creator OS. inffyai.com</li>
        <li>Awyron AI — İş araçlarını tek platformda toplayan yapay zeka katmanı. awyronai.com</li>
      </ul>
      <h2>Rakamlarla Impevos</h2>
      <p>3 ürün, 10 stajyer, 20+ proje, 2026'da kuruldu.</p>
      <h2>Hizmetler</h2>
      <p>Mobil uygulama geliştirme, yapay zeka entegrasyonu, süreç otomasyonu, özel yazılım geliştirme.</p>
      <h2>Ekip</h2>
      <p>Göktuğ Eryılmaz, Kurucu Ortak, CEO. Burak Gökçe, Kurucu Ortak, CTO. Tolga Bıyık, Kurucu Ortak, CPO.</p>
      <h2>İletişim</h2>
      <p>info@impevos.com.tr</p>
    `,
  },
  '/kvkk': {
    title: 'KVKK Aydınlatma Metni | IMPEVOS',
    description: 'IMPEVOS kişisel verilerin korunması aydınlatma metni.',
    body: '<h1>KVKK Aydınlatma Metni</h1><p>İletişim ve staj formlarındaki kişisel veriler, talebi yanıtlamak ve başvuruyu değerlendirmek için işlenir. Başvurular için info@impevos.com.tr.</p>',
  },
  '/gizlilik': {
    title: 'Gizlilik Politikası | IMPEVOS',
    description: 'IMPEVOS gizlilik politikası.',
    body: '<h1>Gizlilik Politikası</h1><p>impevos.com sitesinde gezinmek hesap açmayı gerektirmez. Form gönderildiğinde yazılan bilgiler işlenir.</p>',
  },
  '/cerez-politikasi': {
    title: 'Çerez Politikası | IMPEVOS',
    description: 'IMPEVOS çerez politikası.',
    body: '<h1>Çerez Politikası</h1><p>Site, çerez tercihinizi hatırlamak için zorunlu impevos-consent çerezini kullanır. Analiz veya reklam çerezi yüklenmez.</p>',
  },
}

function prerenderPlugin() {
  return {
    name: 'impevos-prerender',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist')
      const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
      for (const [route, page] of Object.entries(PAGES)) {
        const html = shell
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`)
          .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${page.description}" />`)
          .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`)
        const file = route === '/'
          ? path.join(dist, 'index.html')
          : path.join(dist, route.slice(1), 'index.html')
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, html)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), prerenderPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 5173,
  },
  appType: 'spa',
})
