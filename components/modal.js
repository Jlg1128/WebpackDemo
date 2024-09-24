const { getChatBiProductName, escapeRegularJsInclude } = require('./helper');
// import {getChatBiProductName, escapeRegularJsInclude} from './helper';
import './modal.scss';

export default function RegularFac() {
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