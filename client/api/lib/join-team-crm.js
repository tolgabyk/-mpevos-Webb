import { getQuestionSet, getDepartment } from './join-team-departments.js'

function yesNo(val) {
  if (val === 'yes' || val === true) return 'yes'
  if (val === 'no' || val === false) return 'no'
  return val || 'no'
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

/** CRM panelinin pazarlama başvurularında beklediği ek alanlar */
export function appendMarketingCrmFields(fd, app) {
  if (getQuestionSet(app.applicationType) !== 'marketing') return

  const dept = getDepartment(app.applicationType)
  const marketingRole = app.marketingRole || dept?.marketingRole || app.applicationType || 'genel'
  const salesExperience = buildSalesExperience(app)
  const b2bB2cExperience = buildB2bB2cExperience(app)

  fd.append('sales_experience', salesExperience)
  fd.append('b2b_b2c_experience', b2bB2cExperience)
  fd.append('b2b_b2c', b2bB2cExperience)
  fd.append('b2b_experience', b2bB2cExperience)
  fd.append('marketing_experience', firstText(app.marketingExperience, salesExperience))
  fd.append('marketing_role', marketingRole)
  fd.append('communication_score', firstText(app.communicationScore, '5'))
  fd.append('how_to_market', firstText(app.howToMarketImpevos, 'Başvuru formunda belirtildi'))
  fd.append('business_meetings', yesNo(app.businessMeetings))
  fd.append('phone_meetings', yesNo(app.phoneFaceToFace))
  fd.append('cold_calling', yesNo(app.coldCallingComfort))
  fd.append('sales_targets', yesNo(app.salesTargets))
  fd.append('customer_tracking', yesNo(app.customerTracking))
  fd.append('crm_tracking', yesNo(app.crmTrackingSales))
  fd.append('social_media_content', yesNo(app.socialMediaContent))
  fd.append('campaign_experience', app.campaignExperience || '')
  fd.append('design_tools', app.designTools || '')
  fd.append('content_examples', app.contentExamples || '')
  fd.append('platform_experience', app.platformExperience || '')
}
