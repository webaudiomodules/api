/** @typedef {import('./types').WamProcessor} IWamProcessor */

/**
 * The function can be stringified using `function.toString()`,
 * then inject to the audio thread using `URL.createObjectURL()`.
 * See `addFunctionModule` in the SDK.
 */
const getWamProcessor = (moduleId) => {
	/** @type {import('./types').AudioWorkletGlobalScope} */
	const { AudioWorkletProcessor } = globalThis;

	/**
	 * WebAudioModule v2 Processor API,
	 * used in the audio thread, see d.ts file for more information.
	 * @abstract
	 * @implements {IWamProcessor}
	 */
	class WamProcessor extends AudioWorkletProcessor {
		get groupId() { throw new Error('Not Implemented.'); return null; }

		get moduleId() { throw new Error('Not Implemented.'); return null; }
	
		get instanceId() { throw new Error('Not Implemented.'); return null; }
	
		getCompensationDelay() { throw new Error('Not Implemented.'); return null; }
	
		scheduleEvents(...events) { throw new Error('Not Implemented.'); }
	
		emitEvents(...events) { throw new Error('Not Implemented.'); }
	
		clearEvents() { throw new Error('Not Implemented.'); }
	
		destroy() { throw new Error('Not Implemented.'); }
	}
	
	return WamProcessor;
};

export default getWamProcessor;
