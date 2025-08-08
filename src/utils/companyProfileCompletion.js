export default function calculateCompanyProfileCompletion(profileData) {
  if (!profileData) return 0;

  const fields = [
    'about_us',
    'company_logo',
    'organization_type',
    'industry_types',
    'team_size',
    'company_vision',
    'social_links'
  ];

  let completedFields = 0;

  fields.forEach(field => {
    if (field === 'social_links') {
      // Check if at least one social link exists
      if (profileData[field] && Object.values(profileData[field]).some(val => val)) {
        completedFields++;
      }
    } else if (profileData[field]) {
      completedFields++;
    }
  });

  return Math.round((completedFields / fields.length) * 100);
}