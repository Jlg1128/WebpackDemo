const loaderUtils = require('loader-utils');
const webpack = require('webpack');
function loader(source) {
  return source;
}

loader.pitch = function (remainingRequest, precedingRequest, data) {
  const requestPath = '!!' + remainingRequest;
  // const dep = new webpack.Dependency();
  // dep.
  // this._module.addDependency(requestPath,);
  return `
    const content = require('${requestPath}');
    module.exports = content;
  `;
}

module.exports = loader;