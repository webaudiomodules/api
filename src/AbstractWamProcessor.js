/** @typedef {import('./types').WamProcessor} IWamProcessor */

/** @type {typeof import('./types').AudioWorkletProcessor} */
const AudioWorkletProcessor = globalThis.AudioWorkletProcessor;

/**
 * WebAudioModule v2 Processor API,
 * used in the audio thread, see d.ts file for more information.
 * @abstract
 * @implements {IWamProcessor}
 */
export default class WamProcessor extends AudioWorkletProcessor {
	get moduleId() { throw new Error('Not Implemented.'); return null; }

	get instanceId() { throw new Error('Not Implemented.'); return null; }

	getCompensationDelay() { throw new Error('Not Implemented.'); return null; }

	scheduleEvents(...events) { throw new Error('Not Implemented.'); }

	emitEvents(...events) { throw new Error('Not Implemented.'); }

	clearEvents() { throw new Error('Not Implemented.'); }

	destroy() { throw new Error('Not Implemented.'); }
}
