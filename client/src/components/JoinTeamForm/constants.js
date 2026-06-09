export const APPLICATION_TYPES = [
  { value: 'software-team', label: 'Yazılım Ekibi' },
  { value: 'marketing-team', label: 'Pazarlama Ekibi' },
  { value: 'active-project-team', label: 'Aktif Proje Ekibi' },
  { value: 'other-departments', label: 'Diğer Departmanlar' },
  { value: 'intern-junior', label: 'Stajyer / Junior Geliştirici' },
  { value: 'volunteer', label: 'Gönüllü / Deneyim Kazanmak İstiyorum' },
]

export const CATEGORIES = [
  {
    id: 'software',
    title: 'Yazılım Ekibi Başvurusu',
    leader: 'Burak Gökce liderliğinde',
    description:
      'Modern yazılım araçlarını kullanabilen, öğrenmeye açık, disiplinli ve sorumluluk sahibi adaylar arıyoruz. Cursor, Claude, Antigravity, ChatGPT, GitHub ve yapay zeka destekli geliştirme araçlarına hakim olanlar öncelikli değerlendirilir.',
    roles: [
      'Frontend Developer', 'Backend Developer', 'iOS Developer', 'Android Developer',
      'React Native Developer', 'Flutter Developer', 'Full Stack Developer',
      'AI / Yapay Zeka Geliştirici', 'UI/UX Designer', 'DevOps / Deployment destek ekibi', 'QA / Test ekibi',
    ],
  },
  {
    id: 'marketing',
    title: 'Pazarlama Ekibi Başvurusu',
    description:
      'Yazılım ürünlerimizi, panellerimizi, mobil uygulamalarımızı ve dijital çözümlerimizi işletmelere tanıtmak için sosyal medya, satış, reklam, müşteri görüşmeleri ve marka iletişimi alanlarında görev alacak kişiler arıyoruz.',
    roles: [
      'Satış temsilcisi', 'Sosyal medya ekibi', 'İçerik üreticisi', 'Reklam ve kampanya ekibi',
      'Müşteri görüşmeleri ekibi', 'Marka iletişimi', 'İş geliştirme', 'Dijital pazarlama',
    ],
  },
  {
    id: 'active-project',
    title: 'Aktif Proje Ekipleri Başvurusu',
    description:
      'Mevcut müşteri projeleri, mobil uygulamalar, web panelleri, SaaS projeleri, CRM sistemleri ve yapay zeka tabanlı projelerde görev almak isteyen adaylar için.',
    roles: [
      'Frontend', 'Backend', 'Mobil geliştirme', 'UI/UX tasarım', 'İçerik', 'Sosyal medya',
      'Satış', 'Operasyon', 'Proje yönetimi', 'Test ve kalite kontrol', 'Müşteri destek',
    ],
  },
  {
    id: 'other',
    title: 'Diğer Departman Başvuruları',
    description:
      'Operasyon, tasarım, içerik, proje yönetimi ve şirket içi süreçler için genel başvurular.',
    roles: [
      'Operasyon ekibi', 'Proje yönetimi', 'İnsan kaynakları / ekip koordinasyonu', 'Grafik tasarım',
      'Video edit', 'İçerik yazarlığı', 'Sosyal medya yönetimi', 'Müşteri ilişkileri',
      'Yönetici asistanlığı', 'Topluluk yönetimi',
    ],
  },
]

export const SOFTWARE_ROLES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'react-native', label: 'React Native' },
  { value: 'ui-ux', label: 'UI/UX' },
  { value: 'ai', label: 'AI / Yapay Zeka' },
  { value: 'devops', label: 'DevOps' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'qa', label: 'QA / Test' },
]

export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Evet' },
  { value: 'no', label: 'Hayır' },
]

export const OTHER_DEPARTMENTS = [
  'Operasyon ekibi', 'Proje yönetimi', 'İnsan kaynakları / ekip koordinasyonu',
  'Grafik tasarım', 'Video edit', 'İçerik yazarlığı', 'Sosyal medya yönetimi',
  'Müşteri ilişkileri', 'Yönetici asistanlığı', 'Topluluk yönetimi',
]

export const QUESTION_SET_MAP = {
  'software-team': 'software',
  'intern-junior': 'software',
  'marketing-team': 'marketing',
  'active-project-team': 'active-project',
  'other-departments': 'other',
  volunteer: 'other',
}

export const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  age: '',
  universityInfo: '',
  linkedin: '',
  githubPortfolio: '',
  applicationType: '',
  voluntaryConsent: false,
  website: '',
  softwareRole: '',
  technologies: '',
  cursorUsed: '',
  claudeUsed: '',
  antigravityUsed: '',
  aiToolsUsage: '',
  aiCodingExperience: '',
  realProjectExperience: '',
  githubUsed: '',
  gitBranchKnowledge: '',
  teamWork: '',
  hoursPerWeek: '',
  dailyReport: '',
  crmTracking: '',
  technicalScore: '',
  projectExample: '',
  portfolioLinks: '',
  marketingExperience: '',
  businessMeetings: '',
  phoneFaceToFace: '',
  socialMediaContent: '',
  campaignExperience: '',
  designTools: '',
  hoursPerWeekMarketing: '',
  communicationScore: '',
  howToMarketImpevos: '',
  salesTargets: '',
  customerTracking: '',
  interestedProjects: '',
  bestPosition: '',
  deliveryProcessSeen: '',
  deadlineWork: '',
  dailyReportAP: '',
  crmTrackingAP: '',
  regularMeetings: '',
  onTimeDelivery: '',
  toolsUsedAP: '',
  weeklyHoursAP: '',
  departmentInterest: '',
  departmentExperience: '',
  organizationSkills: '',
  regularReporting: '',
  teamCommunication: '',
  toolsUsedOther: '',
  hoursPerWeekOther: '',
  contributionIdea: '',
  whyImpevos: '',
  differentiator: '',
  disciplineMeaning: '',
  remoteWork: '',
  longTermTeam: '',
  developmentAreas: '',
  responsibilityMeaning: '',
  activeCommunication: '',
  feedbackOpen: '',
}

export const STEPS = ['personal', 'application', 'specific', 'general']

export function getQuestionSet(applicationType) {
  return QUESTION_SET_MAP[applicationType] || 'other'
}

export function getRequiredFields(step, form) {
  const personal = ['fullName', 'email', 'phone', 'city', 'age', 'universityInfo']
  const application = ['applicationType']
  const general = [
    'whyImpevos', 'differentiator', 'disciplineMeaning', 'remoteWork', 'longTermTeam',
    'developmentAreas', 'responsibilityMeaning', 'activeCommunication', 'feedbackOpen',
  ]

  if (step === 0) return personal
  if (step === 1) return application
  if (step === 3) return general

  const set = getQuestionSet(form.applicationType)
  if (set === 'software') {
    return [
      'softwareRole', 'technologies', 'cursorUsed', 'claudeUsed', 'antigravityUsed',
      'aiToolsUsage', 'hoursPerWeek', 'projectExample',
    ]
  }
  if (set === 'marketing') {
    return ['marketingExperience', 'hoursPerWeekMarketing', 'howToMarketImpevos', 'communicationScore']
  }
  if (set === 'active-project') {
    return ['interestedProjects', 'bestPosition', 'weeklyHoursAP', 'onTimeDelivery']
  }
  return ['departmentInterest', 'hoursPerWeekOther', 'contributionIdea']
}
