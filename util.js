/**
 * @param {'preview'|'other'} buildEntry
 */
function replaceBuildEntryLoaderFactory(buildEntry) {
  return function replaceBuildEntryLoader(source, sourceMap) {
    this.cacheable && this.cacheable();
    source = source.replaceAll('process.env.buildEntry', `"${buildEntry}"`);
    this.callback(null, source, sourceMap);
    return source;
  };
}
module.exports = {replaceBuildEntryLoaderFactory};