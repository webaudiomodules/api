/** @type {typeof import('./WamTypes').AudioWorkletProcessor} */
const AudioWorkletProcessor = globalThis.AudioWorkletProcessor;

/**
 * WebAudioModule v2 Processor API,
 * used in the audio thread, see d.ts file for more information.
 * @abstract
 * @typedef {import('./WamTypes').WamProcessor} IWamProcessor
 * @implements {IWamProcessor}
 */
export default class WamProcessor extends AudioWorkletProcessor {
	static generateWamParameterInfo() { throw new Error('Not Implemented.'); return null; }

	get processorId() { throw new Error('Not Implemented.'); return null; }

	get instanceId() { throw new Error('Not Implemented.'); return null; }

	getCompensationDelay() { throw new Error('Not Implemented.'); return null; }

	onEvent(event) { throw new Error('Not Implemented.'); }
}
