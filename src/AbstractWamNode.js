/** @typedef {import('./types').WamNode} IWamNode */

/**
 * WebAudioModule v2 Main AudioNode API,
 * can be used to build a CompositeNode, see d.ts file for more information.
 * @abstract
 * @implements {IWamNode}
 */
export default class WamNode extends AudioWorkletNode {
	constructor(module, options) {
		super(module.audioContext, module.moduleId, options);
	}

	get groupId() { throw new Error('Not Implemented.'); return null; }

	get moduleId() { throw new Error('Not Implemented.'); return null; }

	get instanceId() { throw new Error('Not Implemented.'); return null; }

	get module() { throw new Error('Not Implemented.'); return null; }

	async getCompensationDelay() { throw new Error('Not Implemented.'); return null; }

	async getParameterInfo(...parameterIdQuery) { throw new Error('Not Implemented.'); return null; }

	async getParameterValues(normalized, ...parameterIdQuery) { throw new Error('Not Implemented.'); return null; }

	async setParameterValues(parameterValues) { throw new Error('Not Implemented.'); }

	async getState() { throw new Error('Not Implemented.'); return null; }
	async setState(state) { throw new Error('Not Implemented.'); }

	scheduleEvents(...events) { throw new Error('Not Implemented.'); }

	async clearEvents() { throw new Error('Not Implemented.'); }

	connectEvents(toId, output) { throw new Error('Not Implemented.'); }

	disconnectEvents(toId, output) { throw new Error('Not Implemented.'); }

	destroy() { throw new Error('Not Implemented.'); }
}
