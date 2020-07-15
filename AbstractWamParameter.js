/**
 * WebAudioModule v2 Parameter API,
 * see d.ts file for more information.
 * @abstract
 * @typedef {import('./WamTypes').WamParameter} IWamParameter
 * @implements {IWamParameter}
 */
export default class WamParameter {
	constructor(info) { throw new Error('Not Implemented.'); }

	get info() { throw new Error('Not Implemented.'); return null; }

	get value() { throw new Error('Not Implemented.'); return null; }
	set value(value) { throw new Error('Not Implemented.'); }

	get normalizedValue() { throw new Error('Not Implemented.'); return null; }
	set normalizedValue(normalizedValue) { throw new Error('Not Implemented.'); }
}
