/**
 * WebAudioModule v2 Main AudioNode API,
 * can be used to build a CompositeNode, see d.ts file for more information.
 * @abstract
 */
export default class WamNode extends AudioWorkletNode {
	constructor(audioContext, processorId, instanceId, module, options) {
		super(audioContext, processorId, options);
		throw new Error('Not Implemented.');
	}

	get processorId() { throw new Error('Not Implemented.'); }

	get instanceId() { throw new Error('Not Implemented.'); }

	get module() { throw new Error('Not Implemented.'); }

	async getParameterInfo(parameterIdQuery) { throw new Error('Not Implemented.'); }

	async getParameterValues(normalized, parameterIdQuery) { throw new Error('Not Implemented.'); }

	async setParameterValues(parameterUpdates) { throw new Error('Not Implemented.'); }

	async getState() { throw new Error('Not Implemented.'); }

	async setState(state) { throw new Error('Not Implemented.'); }

	async getCompensationDelay() { throw new Error('Not Implemented.'); }

	addEventCallback(subscriberId, callback) { throw new Error('Not Implemented.'); }

	removeEventCallback(subscriberId) { throw new Error('Not Implemented.'); }

	onEvent(event) { throw new Error('Not Implemented.'); }

	onMessage(message) { throw new Error('Not Implemented.'); }

	destroy() { throw new Error('Not Implemented.'); }
}
