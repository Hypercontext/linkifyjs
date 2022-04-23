import { registerTokenPlugin, registerPlugin } from 'linkifyjs';
import { tokens, ip } from './ip';

registerTokenPlugin('ip', tokens);
registerPlugin('ip', ip);
