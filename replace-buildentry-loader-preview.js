const { replaceBuildEntryLoaderFactory } = require('./util');

/**
 * @param {'preview'|'other'} buildEntry
 */
module.exports = replaceBuildEntryLoaderFactory('preview');