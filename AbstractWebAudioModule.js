/**
 * WebAudioModule v2 Main Class API,
 * see d.ts file for more information.
 * @abstract
 */
export default class WebAudioModule {
	static get isWebAudioModule() { throw new Error('Not Implemented.'); }

	static get descriptor() { throw new Error('Not Implemented.'); }

	static get guiModuleUrl() { throw new Error('Not Implemented.'); }

	static async createInstance(audioContext, initialState) { throw new Error('Not Implemented.'); }

	constructor(audioContext) { throw new Error('Not Implemented.'); }

	get audioContext() { throw new Error('Not Implemented.'); }
	set audioContext(audioContext) { throw new Error('Not Implemented.'); }

	get audioNode() { throw new Error('Not Implemented.'); }
	set audioNode(audioNode) { throw new Error('Not Implemented.'); }

	get initialized() { throw new Error('Not Implemented.'); }
	set initialized(initialized) { throw new Error('Not Implemented.'); }

	get instanceId() { throw new Error('Not Implemented.'); }
	set instanceId(instanceId) { throw new Error('Not Implemented.'); }

	get descriptor() { throw new Error('Not Implemented.'); }

	get name() { throw new Error('Not Implemented.'); }

	get vendor() { throw new Error('Not Implemented.'); }

	get pluginId() { throw new Error('Not Implemented.'); }

	async initialize() { throw new Error('Not Implemented.'); }

	async createAudioNode() { throw new Error('Not Implemented.'); }

	async createGui() { throw new Error('Not Implemented.'); }

	destroy() { throw new Error('Not Implemented.'); }
}
