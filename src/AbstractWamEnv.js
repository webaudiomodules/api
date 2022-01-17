/** @typedef {import('./types').WamEnv} IWamEnv */

/**
 * The function can be stringified using `function.toString()`,
 * then inject to the audio thread using `URL.createObjectURL()`.
 * See `addFunctionModule` in the SDK.
 
 * @param {string} apiVersion
 */
const getWamEnv = (apiVersion) => {
	/**
	 * WebAudioModule v2 WamEnv API in AudioWorkletGlobalScope,
	 * see d.ts file for more information.
	 * @abstract
	 * @implements {IWamEnv}
	 */
	class WamEnv {
		get apiVersion() { throw new Error('Not Implemented.'); return null; }

		getModuleScope(moduleId) { throw new Error('Not Implemented.'); return null; }

		getGroup(groupId, groupKey) { throw new Error('Not Implemented.'); return null; }

		addGroup(group) { throw new Error('Not Implemented.'); return null; }

		removeGroup(group) { throw new Error('Not Implemented.'); return null; }
	
		addWam(wam) { throw new Error('Not Implemented.'); return null; }

		removeWam(wam) { throw new Error('Not Implemented.'); return null; }
	
		connectEvents(groupId, fromId, toId, output) { throw new Error('Not Implemented.'); return null; }

		disconnectEvents(groupId, fromId, toId, output) { throw new Error('Not Implemented.'); return null; }

		emitEvents(from, ...events) { throw new Error('Not Implemented.'); return null; }
	}
	
	return WamEnv;
};

export default getWamEnv;
