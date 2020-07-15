/**
 * WebAudioModule v2 Main AudioNode API,
 * can be used to build a CompositeNode, see d.ts file for more information.
 * @abstract
 * @typedef {import('./WamTypes').WamNode} IWamNode
 * @implements {IWamNode}
 */
export default class WamNode extends AudioWorkletNode {
	/**
	 * @param {import('./WamTypes').WebAudioModule} module
	 * @param {AudioWorkletNodeOptions} options
	 * @memberof WamNode
	 */
	constructor(module, options) {
		super(module.audioContext, module.processorId, options);
		throw new Error('Not Implemented.');
	}

	get processorId() { throw new Error('Not Implemented.'); return null; }

	get instanceId() { throw new Error('Not Implemented.'); return null; }

	get module() { throw new Error('Not Implemented.'); return null; }

	async getCompensationDelay() { throw new Error('Not Implemented.'); return null; }

	async getParameterInfo(parameterIdQuery) { throw new Error('Not Implemented.'); return null; }

	async getParameterValues(normalized, parameterIdQuery) { throw new Error('Not Implemented.'); return null; }

	async setParameterValues(parameterValues) { throw new Error('Not Implemented.'); }

	async getState() { throw new Error('Not Implemented.'); return null; }

	async setState(state) { throw new Error('Not Implemented.'); }

	destroy() { throw new Error('Not Implemented.'); }
}
