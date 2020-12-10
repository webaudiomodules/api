/** @typedef {import('./types').WamDescriptor} IWamDescriptor */
/** @typedef {import('./types').WamNode} IWamNode */
/** @typedef {import('./types').WebAudioModule} IWebAudioModule */

/**
 * WebAudioModule v2 Main Class API,
 * see d.ts file for more information.
 * @abstract
 * @implements {IWebAudioModule}
 */
export default class WebAudioModule {
	/** @type {boolean} */
	static get isWebAudioModuleConstructor() { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {BaseAudioContext} audioContext
	 * @param {any} [initialState]
	 * @returns {Promise<WebAudioModule>}
	 */
	static async createInstance(audioContext, initialState) { throw new Error('Not Implemented.'); return null; }

	/** @param {BaseAudioContext} audioContext */
	constructor(audioContext) {}

	/** @type {boolean} */
	get isWebAudioModule() { throw new Error('Not Implemented.'); return null; }

	/** @type {BaseAudioContext} */
	get audioContext() { throw new Error('Not Implemented.'); return null; }
	set audioContext(audioContext) { throw new Error('Not Implemented.'); }

	/** @type {IWamNode} */
	get audioNode() { throw new Error('Not Implemented.'); return null; }
	set audioNode(audioNode) { throw new Error('Not Implemented.'); }

	/** @type {boolean} */
	get initialized() { throw new Error('Not Implemented.'); return null; }
	set initialized(initialized) { throw new Error('Not Implemented.'); }

	/** @type {string} */
	get moduleId() { throw new Error('Not Implemented.'); return null; }

	/** @type {string} */
	get instanceId() { throw new Error('Not Implemented.'); return null; }
	set instanceId(instanceId) { throw new Error('Not Implemented.'); }

	/** @type {IWamDescriptor} */
	get descriptor() { throw new Error('Not Implemented.'); return null; }

	/** @type {string} */
	get name() { throw new Error('Not Implemented.'); return null; }

	/** @type {string} */
	get vendor() { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {any} [state]
	 * @returns {Promise<WebAudioModule>}
	 */
	async initialize(state) { throw new Error('Not Implemented.'); return null; }

	/**
	 * @param {any} [initialState]
	 * @returns {Promise<IWamNode>}
	 */
	async createAudioNode(initialState) { throw new Error('Not Implemented.'); return null; }

	/**
	 * @returns {Promise<HTMLElement>}
	 */
	async createGui() { throw new Error('Not Implemented.'); return null; }
}
