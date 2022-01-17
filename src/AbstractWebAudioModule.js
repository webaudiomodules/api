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
	static get isWebAudioModuleConstructor() { throw new Error('Not Implemented.'); return null; }

	static async createInstance(groupId, audioContext, initialState) { throw new Error('Not Implemented.'); return null; }

	constructor(groupId, audioContext) {}

	get isWebAudioModule() { throw new Error('Not Implemented.'); return null; }

	get audioContext() { throw new Error('Not Implemented.'); return null; }
	set audioContext(audioContext) { throw new Error('Not Implemented.'); }

	get audioNode() { throw new Error('Not Implemented.'); return null; }
	set audioNode(audioNode) { throw new Error('Not Implemented.'); }

	get initialized() { throw new Error('Not Implemented.'); return null; }
	set initialized(initialized) { throw new Error('Not Implemented.'); }

	get groupId() { throw new Error('Not Implemented.'); return null; }
	
	get moduleId() { throw new Error('Not Implemented.'); return null; }

	get instanceId() { throw new Error('Not Implemented.'); return null; }
	set instanceId(instanceId) { throw new Error('Not Implemented.'); }

	get descriptor() { throw new Error('Not Implemented.'); return null; }

	get name() { throw new Error('Not Implemented.'); return null; }

	get vendor() { throw new Error('Not Implemented.'); return null; }

	async initialize(state) { throw new Error('Not Implemented.'); return null; }

	async createAudioNode(initialState) { throw new Error('Not Implemented.'); return null; }

	async createGui() { throw new Error('Not Implemented.'); return null; }

	destroyGui(gui) { throw new Error('Not Implemented.'); }
}
