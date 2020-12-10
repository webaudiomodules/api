/** @typedef {import('./types').WamParameterInfo} IWamParameterInfo */
/** @typedef {import('./types').WamParameterConfiguration} IWamParameterConfiguration */
/** @typedef {import('./types').WamParameterType} WamParameterType */

/**
 * WebAudioModule v2 ParameterInfo API,
 * see d.ts file for more information.
 * @abstract
 * @implements {IWamParameterInfo}
 */
export default class WamParameterInfo {
	/**
     * @param {string} id
     * @param {IWamParameterConfiguration} config
     */
    constructor(id, config) {}

	/** @type {string} */
	get id() { throw new Error('Not Implemented.'); return null; }

	/** @type {string} */
    get label() { throw new Error('Not Implemented.'); return null; }
	/** @type {WamParameterType} */
    get type() { throw new Error('Not Implemented.'); return null; }
	/** @type {number} */
    get defaultValue() { throw new Error('Not Implemented.'); return null; }
	/** @type {number} */
    get minValue() { throw new Error('Not Implemented.'); return null; }
	/** @type {number} */
    get maxValue() { throw new Error('Not Implemented.'); return null; }
	/** @type {number} */
    get discreteStep() { throw new Error('Not Implemented.'); return null; }
	/** @type {number} */
    get exponent() { throw new Error('Not Implemented.'); return null; }
	/** @type {string[]} */
    get choices() { throw new Error('Not Implemented.'); return null; }
	/** @type {string} */
    get units() { throw new Error('Not Implemented.'); return null; }

	/**
     * @param {number} value
     */
    normalize(value) { throw new Error('Not Implemented.'); return null; }

	/**
     * @param {number} value
     */
	denormalize(value) { throw new Error('Not Implemented.'); return null; }

	/**
     * @param {number} value
     */
	valueString(value) { throw new Error('Not Implemented.'); return null; }
}
