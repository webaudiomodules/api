/** @typedef {import('./types').WamNode} IWamNode */
/** @typedef {import('./types').WebAudioModule} IWebAudioModule */
/** @typedef {import('./types').WamParameterInfoMap} WamParameterInfoMap */
/** @typedef {import('./types').WamParameterDataMap} WamParameterDataMap */
/** @typedef {import('./types').WamEvent} IWamEvent */

/**
 * WebAudioModule v2 Main AudioNode API,
 * can be used to build a CompositeNode, see d.ts file for more information.
 * @abstract
 * @implements {IWamNode}
 */
export default class WamNode extends AudioWorkletNode {
	static generateWamParameters() { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {IWebAudioModule} module
	 * @param {AudioWorkletNodeOptions} options
	 */
	constructor(module, options) {
		super(module.audioContext, module.moduleId, options);
	}

	/** @type {string} */
	get processorId() { throw new Error('Not Implemented.'); return null; }

	/** @type {string} */
	get instanceId() { throw new Error('Not Implemented.'); return null; }

	/** @type {IWebAudioModule} */
	get module() { throw new Error('Not Implemented.'); return null; }

	/**
	 * @returns {Promise<number>}
	 */
	async getCompensationDelay() { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {string | string[]} [parameterIdQuery]
	 * @returns {Promise<WamParameterInfoMap>}
	 */
	async getParameterInfo(parameterIdQuery) { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {boolean} [normalized]
	 * @param {string | string[]} [parameterIdQuery]
	 * @returns {Promise<WamParameterDataMap>}
	 */
	async getParameterValues(normalized, parameterIdQuery) { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {WamParameterDataMap} parameterValues
	 * @returns {Promise<void>}
	 */
	async setParameterValues(parameterValues) { throw new Error('Not Implemented.'); }

    /**
     * @returns {Promise<any>}
     */
	async getState() { throw new Error('Not Implemented.'); return null; }
    /**
     * @param {any} state
     * @returns {Promise<void>}
     */
	async setState(state) { throw new Error('Not Implemented.'); }

    /**
     * @param {IWamEvent} event
     * @returns {void}
     */
	scheduleEvent(event) { throw new Error('Not Implemented.'); }

    /**
     * @returns {Promise<void>}
     */
	async clearEvents() { throw new Error('Not Implemented.'); }

    /**
     * @returns {void}
     */
	destroy() { throw new Error('Not Implemented.'); }
}
