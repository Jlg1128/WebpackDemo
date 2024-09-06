
function getChatBiProductName() {
  const defaultProductName = 'ChatBI';
  if (process.env.SHARED_CONTEXT !== 'web') {
    return defaultProductName;
  }
  return window.customAssets.chatBiStyleConfig && window.customAssets.chatBiStyleConfig.chatBiProductName || defaultProductName;
}

function escapeRegularJsInclude(value) {
  return value.replace(/{/g, '&#123;').replace(/}/g, '&#125;')
}

// console.log(process.env.buildEntry)
// if (process.env.buildEntry === 'preview') {
//   module.exports = {};
// } else {
  module.exports = {
    getChatBiProductName,
    escapeRegularJsInclude
  }
// }
