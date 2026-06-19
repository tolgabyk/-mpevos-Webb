import { getCrmKind, getDepartment, getQuestionSet } from './join-team-departments.js'

const MARKETING_ROLE_LABELS = {
  'sales-rep': 'Satış Temsilcisi',
  'business-dev': 'İş Geliştirme',
  'customer-meetings': 'Müşteri Görüşmeleri',
  'social-media': 'Sosyal Medya',
  'content-creator': 'İçerik Üreticisi',
  'digital-marketing': 'Dijital Pazarlama',
  campaign: 'Reklam ve Kampanya',
  brand: 'Marka İletişimi',
}

function yesNoEn(val, fallback = 'yes') {
  if (val === 'yes' || val === true) return 'yes'
  if (val === 'no' || val === false) return 'no'
  return fallback
}

function yesNoTr(val, fallback = 'Evet') {
  if (val === 'yes' || val === true) return 'Evet'
  if (val === 'no' || val === false) return 'Hayır'
  return fallback
}

function firstText(...values) {
  for (const v of values) {
    const s = String(v ?? '').trim()
    if (s) return s
  }
  return ''
}

function buildSalesExperience(app, force) {
  return firstText(
    app.marketingExperience,
    app.b2bSalesExperience,
    app.departmentExperience,
    force ? 'Başvuru formunda belirtildi' : '',
    'Başvuru formunda belirtildi',
  )
}

function buildB2bB2cExperience(app, force) {
  return firstText(
    app.b2bSalesExperience,
    app.marketingExperience,
    app.departmentExperience,
    force ? 'Başvuru formunda belirtildi' : '',
    'Başvuru formunda belirtildi',
  )
}

function buildCustomerMeetingDescription(app, force) {
  return firstText(
    app.phoneFaceToFace === 'yes' ? 'Telefon ve yüz yüze müşteri görüşmesi yapabilirim.' : '',
    app.businessMeetings === 'yes' ? 'İşletmelerle görüşme yapabilirim.' : '',
    app.b2bSalesExperience,
    app.marketingExperience,
    force ? 'Müşteri görüşmesi yapabilirim.' : '',
    'Müşteri görüşmesi yapabilirim.',
  )
}

function buildCustomerMeetingChoice(app, force) {
  if (app.phoneFaceToFace === 'no' && app.businessMeetings === 'no' && !force) {
    return { en: 'no', tr: 'Hayır' }
  }
  return { en: 'yes', tr: 'Evet' }
}

function meetingValues(mode, meeting, description) {
  if (mode === 'evet') {
    return { en: 'Evet', tr: 'Evet', text: description }
  }
  if (mode === 'text') {
    return { en: description, tr: description, text: description }
  }
  return { en: meeting.en, tr: meeting.tr, text: description }
}

export function buildMarketingPayload(app, { forceDefaults = false, customerMeetingsMode = 'yes' } = {}) {
  const isMarketing =
    getQuestionSet(app.applicationType) === 'marketing' ||
    getCrmKind(app.applicationType) === 'pazarlama'
  if (!isMarketing) return {}

  const dept = getDepartment(app.applicationType)
  const roleSlug = app.marketingRole || dept?.marketingRole || app.applicationType || 'genel'
  const roleLabel = MARKETING_ROLE_LABELS[roleSlug] || roleSlug
  const salesExperience = buildSalesExperience(app, forceDefaults)
  const b2bB2cExperience = buildB2bB2cExperience(app, forceDefaults)
  const meeting = buildCustomerMeetingChoice(app, forceDefaults)
  const description = buildCustomerMeetingDescription(app, forceDefaults)
  const values = meetingValues(customerMeetingsMode, meeting, description)

  return {
    sales_experience: salesExperience,
    salesExperience,
    b2b_b2c_experience: b2bB2cExperience,
    b2b_b2c: b2bB2cExperience,
    b2b_experience: b2bB2cExperience,
    b2bB2cExperience: b2bB2cExperience,
    marketing_experience: firstText(app.marketingExperience, salesExperience),
    marketingExperience: firstText(app.marketingExperience, salesExperience),
    marketing_role: roleSlug,
    marketingRole: roleSlug,
    marketing_role_label: roleLabel,
    communication_score: firstText(app.communicationScore, '5'),
    communicationScore: firstText(app.communicationScore, '5'),
    how_to_market: firstText(app.howToMarketImpevos, 'Başvuru formunda belirtildi'),
    howToMarketImpevos: firstText(app.howToMarketImpevos, 'Başvuru formunda belirtildi'),
    customer_meetings: values.en,
    customer_meeting: values.en,
    customerMeetings: values.en,
    musteri_gorusmesi: values.tr,
    musteri_gorusme: values.tr,
    musteri_gorusme_evet_hayir: values.tr,
    musteri_gorusme_aciklama: values.text,
    customer_meeting_experience: values.text,
    customer_meeting_description: values.text,
    phone_face_to_face: yesNoEn(app.phoneFaceToFace, meeting.en),
    phoneFaceToFace: yesNoEn(app.phoneFaceToFace, meeting.en),
    business_meetings: yesNoEn(app.businessMeetings, meeting.en),
    businessMeetings: yesNoEn(app.businessMeetings, meeting.en),
    phone_meetings: yesNoEn(app.phoneFaceToFace || app.businessMeetings, meeting.en),
    phoneMeetings: yesNoEn(app.phoneFaceToFace || app.businessMeetings, meeting.en),
    cold_calling: yesNoEn(app.coldCallingComfort),
    coldCalling: yesNoEn(app.coldCallingComfort),
    sales_targets: yesNoEn(app.salesTargets),
    salesTargets: yesNoEn(app.salesTargets),
    customer_tracking: yesNoEn(app.customerTracking),
    customerTracking: yesNoEn(app.customerTracking),
    crm_tracking: yesNoEn(app.crmTrackingSales),
    crmTracking: yesNoEn(app.crmTrackingSales),
    social_media_content: yesNoEn(app.socialMediaContent),
    socialMediaContent: yesNoEn(app.socialMediaContent),
    campaign_experience: app.campaignExperience || 'Başvuru formunda belirtildi',
    campaignExperience: app.campaignExperience || 'Başvuru formunda belirtildi',
    design_tools: app.designTools || 'Başvuru formunda belirtildi',
    designTools: app.designTools || 'Başvuru formunda belirtildi',
    content_examples: app.contentExamples || 'Başvuru formunda belirtildi',
    contentExamples: app.contentExamples || 'Başvuru formunda belirtildi',
    platform_experience: app.platformExperience || 'Başvuru formunda belirtildi',
    platformExperience: app.platformExperience || 'Başvuru formunda belirtildi',
  }
}

function appendObjectFields(fd, payload) {
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      fd.append(key, String(value))
    }
  }
}

/** CRM panelinin pazarlama başvurularında beklediği ek alanlar */
export function appendMarketingCrmFields(fd, app, options = {}) {
  const payload = buildMarketingPayload(app, options)
  if (!Object.keys(payload).length) return
  appendObjectFields(fd, payload)
  fd.append('form_data', JSON.stringify(payload))
}
