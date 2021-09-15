import { linkifyInterface } from '../../rollup.config';

export default linkifyInterface('react', {
	globalName: 'Linkify',
	globals: { react: 'React' },
	external: ['react']
});
