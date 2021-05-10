/* eslint-disable max-len */
/**
 * Main `WebAudioModule` interface,
 * its constructor should be the `export default` of the ESM of each WAM.
 *
 * @template Node type of the `audioNode` property, could be any `AudioNode` that implements `WamNode`
 */
export interface WebAudioModule<Node extends WamNode = WamNode> {
    /** should return `true` */
    readonly isWebAudioModule: boolean;
    /** The `AudioContext` where the plugin's node lives in */
    audioContext: BaseAudioContext;
    /** The `AudioNode` that handles audio in the plugin where the host can connect to/from */
    audioNode: Node;
    /** This will return true after calling `initialize()`. */
    initialized: boolean;
    /** The identifier of the current WAM, composed of vender + name */
    readonly moduleId: string;
    /** The unique identifier of the current WAM instance. */
    readonly instanceId: string;
    /** The values from `descriptor.json` */
    readonly descriptor: WamDescriptor;
    /** The WAM's name */
    readonly name: string;
    /** The WAM Vendor's name */
    readonly vendor: string;

    /**
     * This async method must be redefined to get `AudioNode` that
     * will connected to the host.
     * It can be any object that extends `AudioNode` and implements `WamNode`
     */
    createAudioNode(initialState?: any): Promise<WamNode>;
    /**
     * The host will call this method to initialize the WAM with an initial state.
     *
     * In this method, WAM devs should call `createAudioNode()`
     * and store its return `AudioNode` to `this.audioNode`,
     * then set `initialized` to `true` to ensure that
     * the `audioNode` property is available after initialized.
     *
     * These two behaviors are implemented by default in the SDK.
     *
     * The WAM devs can also fetch and preload the GUI Element in while initializing.
     */
    initialize(state?: any): Promise<WebAudioModule>;
    /** Redefine this method to get the WAM's GUI as an HTML `Element`. */
    createGui(): Promise<Element>;
    /** Clean up an element previously returned by `createGui` */
    destroyGui(gui: Element): void
}
export const WebAudioModule: {
    prototype: WebAudioModule;
    /** should return `true` */
    isWebAudioModuleConstructor: boolean;
    /** shorthand for `new` then `initialize`. */
    createInstance(audioContext: BaseAudioContext, initialState?: any): Promise<WebAudioModule>;
    /** WAM constructor, should call `initialize` after constructor to get it work */
    new <Node extends WamNode = WamNode>(audioContext: BaseAudioContext): WebAudioModule<Node>;
};

export type WamIODescriptor = Record<`has${'Audio' | 'Midi' | 'Sysex' | 'Osc' | 'Mpe' | 'Automation'}${'Input' | 'Output'}`, boolean>;

export interface WamDescriptor extends WamIODescriptor {
    name: string;
    vendor: string;
    version: string;
    sdkVersion: string;
    thumbnail: string;
    keywords: string[];
    isInstrument: boolean;
    description: string;
    website: string;
}

// Node

export interface WamNodeOptions {
    /** The identifier of the WAM `AudioWorkletProcessor`. */
    processorId: string;
    /** The unique identifier of the current WAM instance. */
    instanceId: string;
}
export interface WamNode extends AudioNode, Readonly<WamNodeOptions> {
    /** Current `WebAudioModule`. */
    readonly module: WebAudioModule;

    /** Get parameter info for the specified parameter ids, or omit argument to get info for all parameters. */
    getParameterInfo(...parameterIdQuery: string[]): Promise<WamParameterInfoMap>;
    /** Get parameter values for the specified parameter ids, or omit argument to get values for all parameters. */
    getParameterValues(normalized?: boolean, ...parameterIdQuery: string[]): Promise<WamParameterDataMap>;
    /** Set parameter values for the specified parameter ids. */
    setParameterValues(parameterValues: WamParameterDataMap): Promise<void>;
    /** Returns an object (such as JSON or a serialized blob) that can be used to restore the WAM's state. */
    getState(): Promise<any>;
    /** Use an object (such as JSON or a serialized blob) to restore the WAM's state. */
    setState(state: any): Promise<void>;
    /** Compensation delay hint in samples */
    getCompensationDelay(): Promise<number>;
    /** Register a callback function so it will be called when matching events are processed. */
    addEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: WamNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener<K extends keyof WamEventMap>(type: K, listener: (this: WamNode, ev: CustomEvent<WamEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    /** Deregister a callback function so it will no longer be called when matching events are processed. */
    removeEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: WamNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener<K extends keyof WamEventMap>(type: K, listener: (this: WamNode, ev: CustomEvent<WamEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    /** From the main thread, schedule a WamEvent. Listeners will be triggered when the event is processed. */
    scheduleEvents(...event: WamEvent[]): void;
    /** From the main thread, clear all pending WamEvents. */
    clearEvents(): void;
    /** Connect an event output stream to another WAM. If no output index is given, assume output 0. */
    connectEvents(to: WamNode, output?: number): void;
    /** Disconnect an event output stream from another WAM. If no arguments are given, all event streams will be disconnected. */
    disconnectEvents(to?: WamNode, output?: number): void;
    /** Stop processing and remove the node from the graph. */
    destroy(): void;
}
export const WamNode: {
    prototype: WamNode;
    new (module: WebAudioModule, options?: AudioWorkletNodeOptions): WamNode;
};
export interface WamProcessor extends AudioWorkletProcessor {
    readonly moduleId: string;
    readonly instanceId: string;
    /** Compensation delay hint in seconds. */
    getCompensationDelay(): number;
    /** From the audio thread, schedule a WamEvent. Listeners will be triggered when the event is processed. */
    scheduleEvents(...event: WamEvent[]): void;
    /** Schedule events for all the downstream WAMs */
    emitEvents(...events: WamEvent[]): void;
    /** From the audio thread, clear all pending WamEvents. */
    clearEvents(): void;
    /** Stop processing and remove the node from the graph. */
    destroy(): void;
}
export const WamProcessor: {
    prototype: WamProcessor;
    new (options: AudioWorkletNodeOptions): WamProcessor;
};

// PARAMETERS

export type WamParameterType = 'float' | 'int' | 'boolean' | 'choice';

export interface WamParameterConfiguration {
    /** The parameter's human-readable name. */
    label?: string;
    /** The parameter's data type. */
    type?: WamParameterType;
    /** The parameter's default value. Must be within range `[minValue, maxValue]`. */
    defaultValue?: number;
    /** The minimum valid value of the parameter's range. */
    minValue?: number;
    /** The maximum valid value of the parameter's range. */
    maxValue?: number;
    /** The distance between adjacent valid integer values, if applicable. */
    discreteStep?: number;
    /** The nonlinear (exponential) skew of the parameter's range, if applicable. */
    exponent?: number;
    /** A list of human-readable choices corresponding to each valid value in the parameter's range, if applicable. */
    choices?: string[];
    /** A human-readable string representing the units of the parameter's range, if applicable. */
    units?: string;
}

export interface WamParameterInfo extends Readonly<Required<WamParameterConfiguration>> {
    /** The parameter's unique identifier. */
    readonly id: string;
    /** Convert a value from the parameter's denormalized range `[minValue, maxValue]` to normalized range `[0, 1]`. */
    normalize(value: number): number;
    /** Convert a value from normalized range `[0, 1]` to the parameter's denormalized range `[minValue, maxValue]`. */
    denormalize(valueNorm: number): number;
    /** Get a human-readable string representing the given value, including units if applicable. */
    valueString(value: number): string;
}
export const WamParameterInfo: {
    prototype: WamParameterInfo;
    new (id: string, config?: WamParameterConfiguration): WamParameterInfo;
};

export interface WamParameter {
    readonly info: WamParameterInfo;
    value: number;
    normalizedValue: number;
}
export const WamParameter: {
    prototype: WamParameter;
    new (info: WamParameterInfo): WamParameter;
};

export interface WamParameterData {
    id: string;
    value: number;
    normalized: boolean;
}

export type WamParameterMap = Record<string, WamParameter>;

export type WamParameterInfoMap = Record<string, WamParameterInfo>;

export type WamParameterDataMap = Record<string, WamParameterData>;

// EVENTS

export type WamListenerType = 'wam-event' | 'wam-automation' | 'wam-transport' | 'wam-midi' | 'wam-sysex' | 'wam-mpe' | 'wam-osc';

export type WamEventType = keyof WamEventMap;

export interface WamEventBase<T extends WamEventType = WamEventType, D = any> {
    type: T;
    data: D;
    time?: number;
}

export interface WamTransportData {
    /** Bar number */
    currentBar: number;
    /** Timestamp in seconds (WebAudio clock) */
    currentBarStarted: number;
    /** Beats per Minute */
    tempo: number;
    /** Beats count per Bar */
    timeSigNumerator: number;
    /** Beat duration indicator */
    timeSigDenominator: number;
}

export interface WamMidiData {
    bytes: [number, number, number];
}

export interface WamSysexData {
    bytes: number[];
}

export type WamEventCallback<E extends WamEventType = WamEventType> = (event: WamEventMap[E]) => any;

export interface WamEventMap {
    "automation": WamAutomationEvent;
    "transport": WamTransportEvent;
    "midi": WamMidiEvent;
    "sysex": WamSysexEvent;
    "mpe": WamMpeEvent;
    "osc": WamOscEvent;
}

export type WamEvent = WamAutomationEvent | WamTransportEvent | WamMidiEvent | WamSysexEvent | WamMpeEvent | WamOscEvent;
export type WamAutomationEvent = WamEventBase<'automation', WamParameterData>;
export type WamTransportEvent = WamEventBase<'transport', WamTransportData>;
export type WamMidiEvent = WamEventBase<'midi', WamMidiData>;
export type WamSysexEvent = WamEventBase<'sysex', WamSysexData>;
export type WamMpeEvent = WamEventBase<'mpe', WamMidiData>;
export type WamOscEvent = WamEventBase<'osc', string>;

export interface AudioWorkletProcessor {
    port: MessagePort;
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
export const AudioWorkletProcessor: {
    parameterDescriptors: AudioParamDescriptor[];
    new (options: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

export interface WamEnv {
    /** Stores a graph of WamProcessors connected with `connectEvents` for each output of processors */
    readonly eventGraph: Map<WamProcessor, Set<WamProcessor>[]>;
    /** processors map with `instanceId` */
    readonly processors: Record<string, WamProcessor>;
    /** The method should be called when a processor instance is created */
    create(wam: WamProcessor): void;
    /** Connect events between `WamProcessor`s, the output number is 0 by default */
    connectEvents(from: WamProcessor, to: WamProcessor, output?: number): void;
    /** Disonnect events between `WamProcessor`s, the output number is 0 by default, if `to` is omitted, will disconnect every connections */
    disconnectEvents(from: WamProcessor, to?: WamProcessor, output?: number): void;
    /** The method should be called when a processor instance is destroyed */
    destroy(wam: WamProcessor): void;
}

// RingBuffer

export type TypedArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor | BigInt64ArrayConstructor | BigInt64ArrayConstructor;

export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigInt64Array;

/**
 * A Single Producer - Single Consumer thread-safe wait-free ring buffer.
 * The producer and the consumer can be on separate threads, but cannot change roles,
 * except with external synchronization.
 *
 * @author padenot
 */
export interface RingBuffer<T extends TypedArray> {
    /** Returns the type of the underlying ArrayBuffer for this RingBuffer. This allows implementing crude type checking. */
    readonly type: string;
    /** Push bytes to the ring buffer. `bytes` is a typed array of the same type as passed in the ctor, to be written to the queue. Returns the number of elements written to the queue. */
    push(elements: T): number;
    /** Read `elements.length` elements from the ring buffer. `elements` is a typed array of the same type as passed in the ctor. Returns the number of elements read from the queue, they are placed at the beginning of the array passed as parameter. */
    pop(elements: T): number;
    /** True if the ring buffer is empty false otherwise. This can be late on the reader side: it can return true even if something has just been pushed. */
    readonly empty: boolean;
    /** True if the ring buffer is full, false otherwise. This can be late on the write side: it can return true when something has just been popped. */
    readonly full: boolean;
    /** The usable capacity for the ring buffer: the number of elements that can be stored. */
    readonly capacity: number;
    /** Number of elements available for reading. This can be late, and report less elements that is actually in the queue, when something has just been enqueued. */
    readonly availableRead: number;
    /** Number of elements available for writing. This can be late, and report less elements that is actually available for writing, when something has just been dequeued. */
    readonly availableWrite: number;
}
export const RingBuffer: {
    getStorageForCapacity(capacity: number, Type: TypedArrayConstructor): SharedArrayBuffer;
    /**
     * `sab` is a SharedArrayBuffer with a capacity calculated by calling
     * `getStorageForCapacity` with the desired capacity.
     */
    new <T extends TypedArrayConstructor>(sab: SharedArrayBuffer, Type: T): RingBuffer<InstanceType<T>>;
};

export interface AudioWorkletGlobalScope {
    registerProcessor: (name: string, constructor: new (options: any) => AudioWorkletProcessor) => void;
    currentFrame: number;
    currentTime: number;
    sampleRate: number;
    AudioWorkletProcessor: typeof AudioWorkletProcessor;
    webAudioModules: WamEnv;
    RingBuffer: typeof RingBuffer;
}
