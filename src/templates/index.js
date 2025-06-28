
// Add intelligence report template to registry
const intelligenceReport = require('./intelligence-report');

// Export with existing templates
module.exports = {
  ...require('./index'), // Existing templates
  'intelligence-report': intelligenceReport
};
