export const DEPARTMENTS = [
  { value: 'software', label: 'Yazılım Ekibi', group: 'tech', questionSet: 'software', crmKind: 'yazilim', description: 'Genel yazılım geliştirme, modern araçlar ve ekip projeleri.' },
  { value: 'frontend', label: 'Frontend Geliştirme', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'frontend', description: 'React, web arayüzleri ve kullanıcı deneyimi odaklı geliştirme.' },
  { value: 'backend', label: 'Backend Geliştirme', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'backend', description: 'API, veritabanı, sunucu tarafı ve sistem mimarisi.' },
  { value: 'fullstack', label: 'Full Stack Geliştirme', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'fullstack', description: 'Frontend ve backend birlikte uçtan uca proje geliştirme.' },
  { value: 'mobile-ios', label: 'Mobil Geliştirme — iOS', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'ios', description: 'Swift / iOS uygulama geliştirme.' },
  { value: 'mobile-android', label: 'Mobil Geliştirme — Android', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'android', description: 'Kotlin / Android uygulama geliştirme.' },
  { value: 'mobile-cross', label: 'Mobil Geliştirme — React Native / Flutter', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'react-native', description: 'Çapraz platform mobil uygulama geliştirme.' },
  { value: 'ai-ml', label: 'Yapay Zeka & Veri', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'ai', description: 'AI modelleri, otomasyon ve veri odaklı çözümler.' },
  { value: 'devops', label: 'DevOps & Altyapı', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'devops', description: 'Deployment, CI/CD, sunucu ve altyapı yönetimi.' },
  { value: 'qa', label: 'QA / Test & Kalite', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'qa', description: 'Test süreçleri, kalite kontrol ve hata takibi.' },
  { value: 'ui-ux', label: 'UI/UX Tasarım', group: 'tech', questionSet: 'software', crmKind: 'yazilim', softwareRole: 'ui-ux', description: 'Arayüz tasarımı, kullanıcı deneyimi ve prototipleme.' },
  { value: 'rd', label: 'Ar-Ge Ekibi', group: 'tech', questionSet: 'general', crmKind: 'diger', leader: 'Kübra Utanğaç liderliğinde', description: 'Araştırma, inovasyon ve yeni teknoloji keşfi.' },
  { value: 'sales-marketing', label: 'Satış ve Pazarlama', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', leader: 'Mehmet Efe Dur liderliğinde', description: 'Yazılım ürünlerini işletmelere tanıtma, satış ve pazarlama.' },
  { value: 'sales-rep', label: 'Satış Temsilcisi', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'sales-rep', description: 'B2B satış, müşteri görüşmeleri ve hedef odaklı çalışma.' },
  { value: 'business-dev', label: 'İş Geliştirme', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'business-dev', leader: 'Şükrü Ata Erenkuş liderliğinde', description: 'Yeni iş fırsatları, ortaklıklar ve büyüme.' },
  { value: 'customer-meetings', label: 'Müşteri Görüşmeleri', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'customer-meetings', description: 'Telefon ve yüz yüze müşteri iletişimi.' },
  { value: 'digital-marketing', label: 'Dijital Pazarlama', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'digital-marketing', description: 'Dijital kanallar, reklam ve performans pazarlama.' },
  { value: 'social-media', label: 'Sosyal Medya Yönetimi', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'social-media', description: 'Sosyal medya stratejisi, içerik ve topluluk yönetimi.' },
  { value: 'content-creator', label: 'İçerik Üreticisi', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'content-creator', description: 'Video, görsel ve metin içerik üretimi.' },
  { value: 'campaign', label: 'Reklam & Kampanya', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'campaign', description: 'Reklam kampanyaları, Meta/Google Ads ve marka tanıtımı.' },
  { value: 'brand', label: 'Marka İletişimi', group: 'sales', questionSet: 'marketing', crmKind: 'pazarlama', marketingRole: 'brand', description: 'Marka kimliği, kurumsal iletişim ve PR.' },
  { value: 'project-management', label: 'Proje Yönetimi', group: 'ops', questionSet: 'general', crmKind: 'diger', description: 'Proje planlama, takip ve ekip koordinasyonu.' },
  { value: 'operations', label: 'Operasyon', group: 'ops', questionSet: 'general', crmKind: 'diger', description: 'Şirket içi süreçler, operasyonel verimlilik.' },
  { value: 'hr', label: 'İnsan Kaynakları', group: 'ops', questionSet: 'general', crmKind: 'diger', description: 'İK süreçleri, ekip koordinasyonu ve aday yönetimi.' },
  { value: 'executive-assistant', label: 'Yönetici Asistanlığı', group: 'ops', questionSet: 'general', crmKind: 'diger', description: 'Yönetim desteği, organizasyon ve iletişim.' },
  { value: 'customer-relations', label: 'Müşteri İlişkileri', group: 'ops', questionSet: 'general', crmKind: 'diger', description: 'Müşteri memnuniyeti ve ilişki yönetimi.' },
  { value: 'customer-support', label: 'Müşteri Destek', group: 'ops', questionSet: 'general', crmKind: 'diger', description: 'Teknik destek, ticket yönetimi ve kullanıcı yardımı.' },
  { value: 'graphic-design', label: 'Grafik Tasarım', group: 'design', questionSet: 'general', crmKind: 'diger', description: 'Görsel tasarım, marka materyalleri ve kreatif üretim.' },
  { value: 'video-media', label: 'Video & Medya Prodüksiyon', group: 'design', questionSet: 'general', crmKind: 'diger', description: 'Video kurgu, motion ve medya içerik üretimi.' },
  { value: 'content-writing', label: 'İçerik Yazarlığı', group: 'design', questionSet: 'general', crmKind: 'diger', description: 'Blog, web metinleri ve kurumsal içerik yazımı.' },
  { value: 'community', label: 'Topluluk Yönetimi', group: 'design', questionSet: 'general', crmKind: 'diger', description: 'Topluluk oluşturma, etkinlik ve üye yönetimi.' },
]

export const DEPARTMENT_GROUPS = [
  { id: 'tech', title: 'Teknoloji & Yazılım', subtitle: 'Yazılım geliştirme, AI, mobil ve altyapı ekipleri' },
  { id: 'sales', title: 'Satış & Pazarlama', subtitle: 'Satış, dijital pazarlama, sosyal medya ve marka iletişimi' },
  { id: 'ops', title: 'Operasyon & Yönetim', subtitle: 'Proje yönetimi, operasyon, İK ve müşteri süreçleri' },
  { id: 'design', title: 'Tasarım & İçerik', subtitle: 'Grafik tasarım, video, içerik ve topluluk yönetimi' },
]

export const SALES_MARKETING_ROLE_GROUPS = {
  sales: ['sales-rep', 'business-dev', 'customer-meetings'],
  content: ['social-media', 'content-creator', 'digital-marketing', 'campaign', 'brand'],
}

const deptMap = new Map(DEPARTMENTS.map(d => [d.value, d]))

export function getDepartment(value) {
  return deptMap.get(value) || null
}

export function getDepartmentLabel(value) {
  return getDepartment(value)?.label || value || ''
}

export function getQuestionSet(applicationType) {
  return getDepartment(applicationType)?.questionSet || 'general'
}

export function getCrmKind(applicationType) {
  return getDepartment(applicationType)?.crmKind || 'diger'
}

export function getCrmSubmitKind(applicationType) {
  return getCrmKind(applicationType) === 'pazarlama' ? 'diger' : getCrmKind(applicationType)
}

export function getMarketingRoleGroup(marketingRole) {
  if (SALES_MARKETING_ROLE_GROUPS.sales.includes(marketingRole)) return 'sales'
  if (SALES_MARKETING_ROLE_GROUPS.content.includes(marketingRole)) return 'content'
  return null
}

export function getPresetRoles(applicationType) {
  const dept = getDepartment(applicationType)
  return {
    softwareRole: dept?.softwareRole || '',
    marketingRole: dept?.marketingRole || '',
  }
}

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map(({ value, label }) => ({ value, label }))

export function getDepartmentsByGroup(groupId) {
  return DEPARTMENTS.filter(d => d.group === groupId)
}
