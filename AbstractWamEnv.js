/** @typedef {import('./types').WamEnv} IWamEnv */

/**
 * WebAudioModule v2 WamEnv API in AudioWorkletGlobalScope,
 * see d.ts file for more information.
 * @abstract
 * @implements {IWamEnv}
 */
export default class WamEnv {
	get graph() { throw new Error('Not Implemented.'); return null; }

	get processors() { throw new Error('Not Implemented.'); return null; }

	create(wam) { throw new Error('Not Implemented.'); return null; }

	connectEvents(from, output, to) { throw new Error('Not Implemented.'); return null; }

	disconnectEvents(from, output, to) { throw new Error('Not Implemented.'); return null; }

	destroy(wam) { throw new Error('Not Implemented.'); return null; }
}
