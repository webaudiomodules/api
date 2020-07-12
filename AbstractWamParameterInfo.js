/**
 * WebAudioModule v2 Parameter API,
 * see d.ts file for more information.
 * @abstract
 */
export default class WamParameter {
	constructor(info) { throw new Error('Not Implemented.'); }

	get id() { throw new Error('Not Implemented.'); }

	get info() { throw new Error('Not Implemented.'); }

	get value() { throw new Error('Not Implemented.'); }
	set value(value) { throw new Error('Not Implemented.'); }

	get normalizedValue() { throw new Error('Not Implemented.'); }
	set normalizedValue(normalizedValue) { throw new Error('Not Implemented.'); }
}
