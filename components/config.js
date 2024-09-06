require('../other/common');
import('./config2').then((x) => {
  window.a = x.config2()
});
// const x = require('./config2')
// window.a = x.config2()

module.exports = {
  config() {

  }
}