module.exports = function (source) {
  // console.log('🦊source', source.replace('process.env.buildEntry', 'other'));
  // console.log(this.utils);
  this.callback(null, source.replace('process.env.buildEntry', 'other'));
}