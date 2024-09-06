module.exports = function (source) {
  console.log('🦊source', source.replace('process.env.buildEntry', 'other'));
  this.callback(null, source.replace('process.env.buildEntry', 'other'));
}