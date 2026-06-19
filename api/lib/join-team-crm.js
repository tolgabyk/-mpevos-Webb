function yesNo(val) {
  if (val === 'yes' || val === true) return 'yes'
  if (val === 'no' || val === false) return 'no'
  return val || ''
}

function buildSalesExperience(app) {
  const parts = [app.marketingExperience, app.b2bSalesExperience].filter(v => String(v || '').trim())
  return parts.join('\n\n')
}

import { getQuestionSet } from './join-team-departments.js'

/** CRM panelinin pazarlama başvurularında beklediği ek alanlar */
export function appendMarketingCrmFields(fd, app) {
  if (getQuestionSet(app.applicationType) !== 'marketing') return

  const salesExperience = buildSalesExperience(app)
  fd.append('sales_experience', salesExperience)
  fd.append('marketing_experience', app.marketingExperience || salesExperience)
  fd.append('marketing_role', app.marketingRole || '')
  fd.append('communication_score', String(app.communicationScore || ''))
  fd.append('how_to_market', app.howToMarketImpevos || '')
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
