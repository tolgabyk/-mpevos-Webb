import { getCrmKind, getDepartment, getQuestionSet } from '../data/joinTeamDepartments.js'

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
  const hasExplicitNo =
    app.phoneFaceToFace === 'no' &&
    app.businessMeetings === 'no' &&
    !force

  if (hasExplicitNo) {
    return { en: 'no', tr: 'Hayır' }
  }

  if (app.phoneFaceToFace === 'yes' || app.businessMeetings === 'yes' || force) {
    return { en: 'yes', tr: 'Evet' }
  }

  return { en: 'yes', tr: 'Evet' }
}

function appendField(fd, names, value) {
  for (const name of names) {
    fd.append(name, value)
  }
}

export function appendMarketingCrmFields(fd, app, { forceDefaults = false } = {}) {
  const isMarketing =
    getQuestionSet(app.applicationType) === 'marketing' ||
    getCrmKind(app.applicationType) === 'pazarlama'
  if (!isMarketing) return

  const dept = getDepartment(app.applicationType)
  const roleSlug = app.marketingRole || dept?.marketingRole || app.applicationType || 'genel'
  const marketingRole = MARKETING_ROLE_LABELS[roleSlug] || roleSlug
  const salesExperience = buildSalesExperience(app, forceDefaults)
  const b2bB2cExperience = buildB2bB2cExperience(app, forceDefaults)
  const customerMeeting = buildCustomerMeetingChoice(app, forceDefaults)
  const customerMeetingDescription = buildCustomerMeetingDescription(app, forceDefaults)

  appendField(fd, ['sales_experience', 'salesExperience'], salesExperience)
  appendField(fd, ['b2b_b2c_experience', 'b2b_b2c', 'b2b_experience', 'b2bB2cExperience'], b2bB2cExperience)
  appendField(fd, ['marketing_experience', 'marketingExperience'], firstText(app.marketingExperience, salesExperience))
  appendField(fd, ['marketing_role', 'marketingRole'], marketingRole)
  appendField(fd, ['communication_score', 'communicationScore'], firstText(app.communicationScore, '5'))
  appendField(fd, ['how_to_market', 'howToMarketImpevos'], firstText(app.howToMarketImpevos, 'Başvuru formunda belirtildi'))

  // CRM "Müşteri görüşmesi" — yes/no (metin değil)
  appendField(fd, ['customer_meetings', 'customer_meeting', 'customerMeetings'], customerMeeting.en)
  appendField(fd, ['musteri_gorusmesi', 'musteri_gorusme', 'musteri_gorusme_evet_hayir'], customerMeeting.tr)
  appendField(fd, ['phone_face_to_face', 'phoneFaceToFace'], yesNoEn(app.phoneFaceToFace, customerMeeting.en))
  appendField(fd, ['business_meetings', 'businessMeetings'], yesNoEn(app.businessMeetings, customerMeeting.en))
  appendField(fd, ['phone_meetings', 'phoneMeetings'], yesNoEn(app.phoneFaceToFace || app.businessMeetings, customerMeeting.en))

  appendField(fd, [
    'musteri_gorusme_aciklama',
    'customer_meeting_experience',
    'customer_meeting_description',
    'client_meetings',
    'client_meeting',
  ], customerMeetingDescription)

  appendField(fd, ['cold_calling', 'coldCalling'], yesNoEn(app.coldCallingComfort))
  appendField(fd, ['sales_targets', 'salesTargets'], yesNoEn(app.salesTargets))
  appendField(fd, ['customer_tracking', 'customerTracking'], yesNoEn(app.customerTracking))
  appendField(fd, ['crm_tracking', 'crmTracking'], yesNoEn(app.crmTrackingSales))
  appendField(fd, ['social_media_content', 'socialMediaContent'], yesNoEn(app.socialMediaContent))

  appendField(fd, ['campaign_experience', 'campaignExperience'], app.campaignExperience || 'Başvuru formunda belirtildi')
  appendField(fd, ['design_tools', 'designTools'], app.designTools || 'Başvuru formunda belirtildi')
  appendField(fd, ['content_examples', 'contentExamples'], app.contentExamples || 'Başvuru formunda belirtildi')
  appendField(fd, ['platform_experience', 'platformExperience'], app.platformExperience || 'Başvuru formunda belirtildi')
}
