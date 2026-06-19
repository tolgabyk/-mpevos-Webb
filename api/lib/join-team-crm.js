import { getQuestionSet, getDepartment } from './join-team-departments.js'

/** CRM boş alan kabul etmiyor — cevap yoksa varsayılan 'yes' */
function yesNoDefault(val) {
  if (val === 'yes' || val === true) return 'yes'
  if (val === 'no' || val === false) return 'no'
  return 'yes'
}

function firstText(...values) {
  for (const v of values) {
    const s = String(v ?? '').trim()
    if (s) return s
  }
  return ''
}

function buildSalesExperience(app) {
  return firstText(
    app.marketingExperience,
    app.b2bSalesExperience,
    app.departmentExperience,
    'Başvuru formunda belirtildi',
  )
}

function buildB2bB2cExperience(app) {
  return firstText(
    app.b2bSalesExperience,
    app.marketingExperience,
    app.departmentExperience,
    'Başvuru formunda belirtildi',
  )
}

function buildCustomerMeetings(app) {
  if (app.phoneFaceToFace === 'yes' || app.businessMeetings === 'yes') return 'yes'
  if (app.phoneFaceToFace === 'no' || app.businessMeetings === 'no') return 'no'
  return 'yes'
}

/** CRM panelinin pazarlama başvurularında beklediği ek alanlar */
export function appendMarketingCrmFields(fd, app) {
  if (getQuestionSet(app.applicationType) !== 'marketing') return

  const dept = getDepartment(app.applicationType)
  const marketingRole = app.marketingRole || dept?.marketingRole || app.applicationType || 'genel'
  const salesExperience = buildSalesExperience(app)
  const b2bB2cExperience = buildB2bB2cExperience(app)
  const customerMeetings = buildCustomerMeetings(app)

  fd.append('sales_experience', salesExperience)
  fd.append('b2b_b2c_experience', b2bB2cExperience)
  fd.append('b2b_b2c', b2bB2cExperience)
  fd.append('b2b_experience', b2bB2cExperience)
  fd.append('marketing_experience', firstText(app.marketingExperience, salesExperience))
  fd.append('marketing_role', marketingRole)
  fd.append('communication_score', firstText(app.communicationScore, '5'))
  fd.append('how_to_market', firstText(app.howToMarketImpevos, 'Başvuru formunda belirtildi'))

  fd.append('customer_meetings', customerMeetings)
  fd.append('musteri_gorusmesi', customerMeetings)
  fd.append('customer_meeting', customerMeetings)
  fd.append('business_meetings', yesNoDefault(app.businessMeetings))
  fd.append('phone_meetings', yesNoDefault(app.phoneFaceToFace))
  fd.append('cold_calling', yesNoDefault(app.coldCallingComfort))
  fd.append('sales_targets', yesNoDefault(app.salesTargets))
  fd.append('customer_tracking', yesNoDefault(app.customerTracking))
  fd.append('crm_tracking', yesNoDefault(app.crmTrackingSales))
  fd.append('social_media_content', yesNoDefault(app.socialMediaContent))

  fd.append('campaign_experience', app.campaignExperience || '-')
  fd.append('design_tools', app.designTools || '-')
  fd.append('content_examples', app.contentExamples || '-')
  fd.append('platform_experience', app.platformExperience || '-')
}
