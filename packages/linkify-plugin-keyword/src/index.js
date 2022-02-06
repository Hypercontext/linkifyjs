import { registerPlugin } from 'linkifyjs';
import { keyword, registerKeywords } from './keyword'
export default registerKeywords;

registerPlugin('keyword', keyword);
