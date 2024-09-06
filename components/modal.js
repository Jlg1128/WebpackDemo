const { getChatBiProductName, escapeRegularJsInclude } = require('./helper');


import('./config').then((a) => {
  window.b = a.config;
})

import('./test')

module.exports = function RegularFac() {
  return {
    name: 'regular-fc',
    config() {
      window.regularx = getChatBiProductName();
    },
    openTest() {
      window.test = escapeRegularJsInclude;
    },
    getChatBiProductName
  }
}