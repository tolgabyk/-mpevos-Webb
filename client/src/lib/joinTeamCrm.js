import { getCrmKind, getDepartment, getQuestionSet } from '../data/joinTeamDepartments.js'

function yesNoEn(val) {
  if (val === 'yes' || val === true) return 'yes'
  if (val === 'no' || val === false) return 'no'
  return 'yes'
}

function yesNoTr(val) {
  if (val === 'yes' || val === true) return 'Evet'
  if (val === 'no' || val === false) return 'Hayır'
  return 'Evet'
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

function buildCustomerMeetingText(app, force) {
  return firstText(
    app.phoneFaceToFace === 'yes' ? 'Telefon ve yüz yüze müşteri görüşmesi yapabilirim.' : '',
    app.businessMeetings === 'yes' ? 'İşletmelerle görüşme yapabilirim.' : '',
    app.b2bSalesExperience,
    app.marketingExperience,
    force ? 'Müşteri görüşmesi yapabilirim.' : '',
    'Müşteri görüşmesi yapabilirim.',
  )
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
  const marketingRole = app.marketingRole || dept?.marketingRole || app.applicationType || 'genel'
  const salesExperience = buildSalesExperience(app, forceDefaults)
  const b2bB2cExperience = buildB2bB2cExperience(app, forceDefaults)
  const customerMeetingText = buildCustomerMeetingText(app, forceDefaults)
  const customerMeetingYesEn = yesNoEn(app.phoneFaceToFace || app.businessMeetings)
  const customerMeetingYesTr = yesNoTr(app.phoneFaceToFace || app.businessMeetings)

  appendField(fd, ['sales_experience', 'salesExperience'], salesExperience)
  appendField(fd, ['b2b_b2c_experience', 'b2b_b2c', 'b2b_experience', 'b2bB2cExperience'], b2bB2cExperience)
  appendField(fd, ['marketing_experience', 'marketingExperience'], firstText(app.marketingExperience, salesExperience))
  appendField(fd, ['marketing_role', 'marketingRole'], marketingRole)
  appendField(fd, ['communication_score', 'communicationScore'], firstText(app.communicationScore, '5'))
  appendField(fd, ['how_to_market', 'howToMarketImpevos'], firstText(app.howToMarketImpevos, 'Başvuru formunda belirtildi'))

  appendField(fd, [
    'musteri_gorusme',
    'musteri_gorusmesi',
    'customer_meetings',
    'customer_meeting',
    'customer_interview',
    'client_meetings',
    'client_meeting',
  ], customerMeetingText)

  appendField(fd, ['phone_face_to_face', 'phoneFaceToFace'], customerMeetingYesEn)
  appendField(fd, ['business_meetings', 'businessMeetings'], yesNoEn(app.businessMeetings))
  appendField(fd, ['phone_meetings', 'phoneMeetings'], yesNoEn(app.phoneFaceToFace || app.businessMeetings))
  appendField(fd, ['musteri_gorusme_evet_hayir'], customerMeetingYesTr)
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
