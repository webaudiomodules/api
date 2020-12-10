/** @typedef {import('./types').WamProcessor} IWamProcessor */
/** @typedef {import('./types').WamEvent} IWamEvent */

/** @type {typeof import('./types').AudioWorkletProcessor} */
const AudioWorkletProcessor = globalThis.AudioWorkletProcessor;

/**
 * WebAudioModule v2 Processor API,
 * used in the audio thread, see d.ts file for more information.
 * @abstract
 * @implements {IWamProcessor}
 */
export default class WamProcessor extends AudioWorkletProcessor {
	/** @type {string} */
	get moduleId() { throw new Error('Not Implemented.'); return null; }

	/** @type {string} */
	get instanceId() { throw new Error('Not Implemented.'); return null; }

	/**
	 * @returns {number}
	 */
	getCompensationDelay() { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {IWamEvent} event
	 */
	scheduleEvent(event) { throw new Error('Not Implemented.'); }

	clearEvents() { throw new Error('Not Implemented.'); }

	destroy() { throw new Error('Not Implemented.'); }
}
