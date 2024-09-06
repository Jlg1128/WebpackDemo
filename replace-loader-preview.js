module.exports = function (source) {
  console.log('🦊source', source.replace('process.env.buildEntry', 'preview'));
  this.callback(null, source.replace('process.env.buildEntry', 'preview'));
}