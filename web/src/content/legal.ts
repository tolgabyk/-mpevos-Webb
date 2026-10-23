import type { Locale } from "@/lib/i18n";

export type LegalBlock = { heading: string; paragraphs: readonly string[] };

type LegalDoc = { title: string; updated: string; blocks: readonly LegalBlock[] };

const legal = {
  tr: {
    kvkk: {
      title: "KVKK Aydınlatma Metni",
      updated: "15 Ekim 2026",
      blocks: [
        {
          heading: "Veri sorumlusu",
          paragraphs: [
            "Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında IMPEVOS TEKNOLOJİ A.Ş. tarafından hazırlanmıştır.",
            "Adres, MERSİS numarası ve vergi numarası şirket kaydı netleştikçe bu sayfaya eklenecektir. Bu alanlar şu an yer tutucudur.",
          ],
        },
        {
          heading: "İşlenen veriler ve amaç",
          paragraphs: [
            "İletişim formunda ad, e-posta, şirket adı ve mesaj; staj formunda ad, üniversite, bölüm ve CV işlenir.",
            "Amaç, talebi yanıtlamak, staj başvurusunu değerlendirmek ve yasal yükümlülükleri yerine getirmektir. Veriler pazarlama listesine eklenmez.",
          ],
        },
        {
          heading: "Aktarım ve süre",
          paragraphs: [
            "Form kayıtları, e-posta iletimi için kullanılan sunucu ve posta hizmetine gider. Yurt dışındaki bir hizmet sağlayıcı kullanılıyorsa aktarım, KVKK’daki şartlara göre yapılır.",
            "İletişim kayıtları talebin kapanmasından sonra en fazla 2 yıl, staj başvuruları değerlendirme sürecinin bitiminden sonra en fazla 1 yıl saklanır; daha uzun süre kanunen gerekiyorsa o süre uygulanır.",
          ],
        },
        {
          heading: "Haklarınız",
          paragraphs: [
            "KVKK madde 11 kapsamındaki haklarınız için info@impevos.com.tr adresine yazabilirsiniz. Başvurular, kimlik teyidinden sonra yasal süre içinde yanıtlanır.",
          ],
        },
      ],
    },
    privacy: {
      title: "Gizlilik Politikası",
      updated: "15 Ekim 2026",
      blocks: [
        {
          heading: "Kapsam",
          paragraphs: [
            "Bu politika impevos.com sitesini kapsar. Not Ortağım, İnffy AI ve Awyron’nin kendi uygulamaları ayrı metinler yayımlayabilir.",
          ],
        },
        {
          heading: "Toplanan bilgiler",
          paragraphs: [
            "Siteyi gezmek hesap açmayı gerektirmez. Formu gönderdiğinizde yazdığınız bilgiler ve teknik olarak gerekli bağlantı kayıtları işlenir.",
            "Ödeme almıyoruz. Bu sitede reklam profili oluşturulmaz.",
          ],
        },
        {
          heading: "Güvenlik",
          paragraphs: [
            "Formlar sunucu tarafında doğrulanır. CV dosyaları yalnızca pdf, doc ve docx olarak ve 5 MB sınırının altında kabul edilir.",
            "E-posta iletimi, barındırma ortamındaki posta ayarları tanımlıysa yapılır. Ayar yoksa form hata verir ve alternatif olarak info@impevos.com.tr gösterilir.",
          ],
        },
        {
          heading: "İletişim",
          paragraphs: ["Gizlilik soruları için info@impevos.com.tr adresini kullanın."],
        },
      ],
    },
    cookies: {
      title: "Çerez Politikası",
      updated: "15 Ekim 2026",
      blocks: [
        {
          heading: "Ne kullanıyoruz",
          paragraphs: [
            "Zorunlu çerez: impevos-consent. Çerez bildirimindeki seçiminizi tarayıcınızda tutar. Süre 6 aydır.",
            "Şu anda analiz, reklam veya üçüncü taraf pazarlama çerezi yüklenmez.",
          ],
        },
        {
          heading: "Seçiminiz",
          paragraphs: [
            "“Kabul et” ve “Yalnızca zorunlu” aynı zorunlu çerezi yazar; ikisi de ek izleme başlatmaz. Seçiminizi tarayıcı ayarlarından silebilirsiniz. Banner yeniden görünür.",
          ],
        },
      ],
    },
  },
  en: {
    kvkk: {
      title: "KVKK Notice",
      updated: "15 October 2026",
      blocks: [
        {
          heading: "Controller",
          paragraphs: [
            "This notice is provided by IMPEVOS TEKNOLOJİ A.Ş. under Turkish Law No. 6698 on the Protection of Personal Data.",
            "The street address, MERSIS number, and tax number will be added when the registry details are confirmed. Those fields are placeholders for now.",
          ],
        },
        {
          heading: "Data and purpose",
          paragraphs: [
            "The contact form processes your name, email, company, and message. The internship form processes your name, university, department, and CV.",
            "The purpose is to reply, review the application, and meet legal duties. Submissions are not added to a marketing list.",
          ],
        },
        {
          heading: "Transfers and retention",
          paragraphs: [
            "Form records go to the email service used to deliver them. If that provider is outside Türkiye, the transfer follows the conditions in the KVKK.",
            "Contact records are kept for up to 2 years after the request is closed. Internship applications are kept for up to 1 year after review, unless a longer legal period applies.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "To use the rights in KVKK article 11, write to info@impevos.com.tr. Requests are answered within the legal period after identity is confirmed.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      updated: "15 October 2026",
      blocks: [
        {
          heading: "Scope",
          paragraphs: [
            "This policy covers impevos.com. Not Ortağım, Inffy AI, and Awyron may publish separate notices for their own apps.",
          ],
        },
        {
          heading: "Information we collect",
          paragraphs: [
            "Browsing the site does not require an account. If you submit a form, we process what you type and the connection data required to deliver it.",
            "We do not take payments here, and we do not build an advertising profile.",
          ],
        },
        {
          heading: "Security",
          paragraphs: [
            "Forms are validated on the server. CV files are accepted only as pdf, doc, or docx, under 5 MB.",
            "Email is sent when mail settings exist in the hosting environment. If they do not, the form returns an error and shows info@impevos.com.tr.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: ["For privacy questions, write to info@impevos.com.tr."],
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      updated: "15 October 2026",
      blocks: [
        {
          heading: "What we use",
          paragraphs: [
            "Necessary cookie: impevos-consent. It stores your choice from the cookie notice in this browser for 6 months.",
            "No analytics, advertising, or third-party marketing cookies are loaded.",
          ],
        },
        {
          heading: "Your choice",
          paragraphs: [
            "“Accept” and “Necessary only” both write the same necessary cookie. Neither starts extra tracking. You can delete the choice in your browser settings, and the notice will show again.",
          ],
        },
      ],
    },
  },
} as const;

export type LegalSlug = "kvkk" | "gizlilik" | "cerez-politikasi";

const keyBySlug = {
  kvkk: "kvkk",
  gizlilik: "privacy",
  "cerez-politikasi": "cookies",
} as const;

export function getLegal(locale: Locale, slug: LegalSlug): LegalDoc {
  const key = keyBySlug[slug];
  return legal[locale][key];
}
