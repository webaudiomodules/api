/** @type { typeof import('./WamTypes').AudioWorkletProcessor } */
const AudioWorkletProcessor = AudioWorkletGlobalScope.AudioWorkletProcessor;

/**
 * WebAudioModule v2 Processor API,
 * used in the audio thread, see d.ts file for more information.
 * @abstract
 */
export default class WamProcessor extends AudioWorkletProcessor {
	static generateWamParameterInfo() { throw new Error('Not Implemented.'); }

	get processorId() { throw new Error('Not Implemented.'); }

	get instanceId() { throw new Error('Not Implemented.'); }

	getCompensationDelay() { throw new Error('Not Implemented.'); }

	onEvent(event) { throw new Error('Not Implemented.'); }

	onMessage(message) { throw new Error('Not Implemented.'); }

	destroy() { throw new Error('Not Implemented.'); }
}
