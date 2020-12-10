/** @typedef {import('./types').WamParameterInfo} IWamParameterInfo */
/** @typedef {import('./types').WamParameter} IWamParameter */

/**
 * WebAudioModule v2 Parameter API,
 * see d.ts file for more information.
 * @abstract
 * @implements {IWamParameter}
 */
export default class WamParameter {
	/**
     * @param {IWamParameterInfo} info
     */
	constructor(info) {}

	/** @type {IWamParameterInfo} */
	get info() { throw new Error('Not Implemented.'); return null; }

	/** @type {number} */
	get value() { throw new Error('Not Implemented.'); return null; }
	set value(value) { throw new Error('Not Implemented.'); }

	/** @type {number} */
	get normalizedValue() { throw new Error('Not Implemented.'); return null; }
	set normalizedValue(normalizedValue) { throw new Error('Not Implemented.'); }
}
