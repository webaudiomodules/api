/** @typedef {import('./types').WamGroup} IWamGroup */

/**
 * The function can be stringified using `function.toString()`,
 * then inject to the audio thread using `URL.createObjectURL()`.
 * See `addFunctionModule` in the SDK.
 */
/** @param {string} groupId */
/** @param {string} groupKey */
const initializeWamGroup = (groupId, groupKey) => {
	/**
	 * WebAudioModule v2 WamEnv API in AudioWorkletGlobalScope,
	 * see d.ts file for more information.
	 * @abstract
	 * @implements {IWamGroup}
	 */
	class WamGroup {
		get groupId() { throw new Error('Not Implemented.'); return null; }

		validate(groupKey) { throw new Error('Not Implemented.'); return null; }

		getModuleScope(moduleId) { throw new Error('Not Implemented.'); return null; }

		getEventGraph() { throw new Error('Not Implemented.'); return null; }

		getProcessors() { throw new Error('Not Implemented.'); return null; }
	}
	
	return WamGroup;
};

export default initializeWamGroup;
