import { linkifyInterface } from '../../rollup.config';

export default linkifyInterface('jquery', {
	globalName: false,
	globals: { jquery: 'jQuery' },
	external: ['jquery']
});
