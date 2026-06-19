import {
  DEPARTMENTS,
  DEPARTMENT_GROUPS,
  DEPARTMENT_OPTIONS,
  CATEGORIES,
  SALES_MARKETING_ROLE_GROUPS,
  getDepartment,
  getDepartmentLabel,
  getQuestionSet,
  getCrmKind,
  getMarketingRoleGroup,
  getPresetRoles,
  getDepartmentsByGroup,
} from '../../data/joinTeamDepartments.js'

export {
  DEPARTMENTS,
  DEPARTMENT_GROUPS,
  DEPARTMENT_OPTIONS,
  CATEGORIES,
  SALES_MARKETING_ROLE_GROUPS,
  getDepartment,
  getDepartmentLabel,
  getQuestionSet,
  getCrmKind,
  getMarketingRoleGroup,
  getPresetRoles,
  getDepartmentsByGroup,
}

/** @deprecated use DEPARTMENT_OPTIONS */
export const APPLICATION_TYPES = DEPARTMENT_OPTIONS

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

export const MARKETING_ROLES = [
  { value: 'sales-rep', label: 'Satış Temsilcisi' },
  { value: 'business-dev', label: 'İş Geliştirme' },
  { value: 'customer-meetings', label: 'Müşteri Görüşmeleri' },
  { value: 'social-media', label: 'Sosyal Medya' },
  { value: 'content-creator', label: 'İçerik Üreticisi' },
  { value: 'digital-marketing', label: 'Dijital Pazarlama' },
  { value: 'campaign', label: 'Reklam ve Kampanya' },
  { value: 'brand', label: 'Marka İletişimi' },
]

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
  marketingRole: '',
  marketingExperience: '',
  businessMeetings: '',
  phoneFaceToFace: '',
  b2bSalesExperience: '',
  coldCallingComfort: '',
  crmTrackingSales: '',
  socialMediaContent: '',
  campaignExperience: '',
  designTools: '',
  contentExamples: '',
  platformExperience: '',
  hoursPerWeekMarketing: '',
  communicationScore: '',
  howToMarketImpevos: '',
  salesTargets: '',
  customerTracking: '',
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

export const STEPS = ['personal', 'department', 'specific', 'general']

export function getRequiredFields(step, form) {
  const personal = ['fullName', 'email', 'phone', 'city', 'age', 'universityInfo']
  const department = ['applicationType']
  const general = [
    'whyImpevos', 'differentiator', 'disciplineMeaning', 'remoteWork', 'longTermTeam',
    'developmentAreas', 'responsibilityMeaning', 'activeCommunication', 'feedbackOpen',
  ]

  if (step === 0) return personal
  if (step === 1) return department
  if (step === 3) return general

  const set = getQuestionSet(form.applicationType)
  const dept = getDepartment(form.applicationType)
  const marketingRole = form.marketingRole || dept?.marketingRole || ''

  if (set === 'software') {
    const fields = [
      'technologies', 'cursorUsed', 'claudeUsed', 'antigravityUsed',
      'aiToolsUsage', 'hoursPerWeek', 'projectExample',
    ]
    if (!dept?.softwareRole) fields.unshift('softwareRole')
    return fields
  }
  if (set === 'marketing') {
    const base = ['marketingExperience', 'hoursPerWeekMarketing', 'howToMarketImpevos', 'communicationScore']
    if (!dept?.marketingRole) base.unshift('marketingRole')
    const group = getMarketingRoleGroup(marketingRole)
    if (group === 'sales') {
      return [...base, 'businessMeetings', 'phoneFaceToFace', 'salesTargets']
    }
    if (group === 'content') {
      return [...base, 'socialMediaContent', 'designTools']
    }
    return base
  }
  return ['departmentExperience', 'hoursPerWeekOther', 'contributionIdea']
}
