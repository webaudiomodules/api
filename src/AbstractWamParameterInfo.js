/** @typedef {import('./types').WamParameterInfo} IWamParameterInfo */

/**
 * WebAudioModule v2 ParameterInfo API,
 * see d.ts file for more information.
 * @abstract
 * @implements {IWamParameterInfo}
 */
export default class WamParameterInfo {
    constructor(id, config) {}

	get id() { throw new Error('Not Implemented.'); return null; }

    get label() { throw new Error('Not Implemented.'); return null; }
    get type() { throw new Error('Not Implemented.'); return null; }
    get defaultValue() { throw new Error('Not Implemented.'); return null; }
    get minValue() { throw new Error('Not Implemented.'); return null; }
    get maxValue() { throw new Error('Not Implemented.'); return null; }
    get discreteStep() { throw new Error('Not Implemented.'); return null; }
    get exponent() { throw new Error('Not Implemented.'); return null; }
    get choices() { throw new Error('Not Implemented.'); return null; }
    get units() { throw new Error('Not Implemented.'); return null; }

    normalize(value) { throw new Error('Not Implemented.'); return null; }

	denormalize(value) { throw new Error('Not Implemented.'); return null; }

	valueString(value) { throw new Error('Not Implemented.'); return null; }
}
