/* eslint-disable max-len */
export interface WebAudioModule<Node extends WamNode = WamNode> {
    /** The `AudioContext` where the plugin's node lives */
    audioContext: BaseAudioContext;
    /** The `AudioNode` that handles audio in the plugin where the host can connect to/from */
    audioNode: WamNode;
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
    createAudioNode(): Promise<WamNode>;
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
    /**
     * The host will call this method when destroy the WAM.
     * Make sure this calls every internal destroys.
     */
    destroy(): void;
    // OGC Do we need destroy method here as well?
}
export const WebAudioModule: {
    prototype: WebAudioModule;
    isWebAudioModule: boolean;
    createInstance(audioContext: BaseAudioContext, initialState?: any): Promise<WebAudioModule>;
    descriptor: WamDescriptor;
    guiModuleUrl: string;
    new <Node extends WamNode = WamNode>(audioContext: BaseAudioContext): WebAudioModule<Node>;
};
export interface WamDescriptor {
    name: string;
    vendor: string;
    entry?: string;
    gui: string;
    url?: string;
}

// Node

export interface WamNodeOptions {
    processorId: string;
    instanceId: string;
}
export interface WamNode extends AudioWorkletNode {
    readonly processorId: string;
    readonly instanceId: string;
    readonly module: WebAudioModule;

    /** Get parameter info for the specified parameter ids, or omit argument to get info for all parameters. */
    getParameterInfo(): Promise<WamParameterInfoMap>;
    getParameterInfo(parameterIdQuery: string): Promise<WamParameterInfoMap>;
    getParameterInfo(parameterIdQuery: string[]): Promise<WamParameterInfoMap>;
    /** Get parameter values for the specified parameter ids, or omit argument to get values for all parameters. */
    getParameterValues(): Promise<WamParameterDataMap>;
    getParameterValues(normalized: boolean): Promise<WamParameterDataMap>;
    getParameterValues(normalized: boolean, parameterIdQuery: string): Promise<WamParameterDataMap>;
    getParameterValues(normalized: boolean, parameterIdQuery: string[]): Promise<WamParameterDataMap>;
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
    scheduleEvent(event: WamEvent): void;
    /** From the main thread, clear all pending WamEvents. */
    clearEvents(): Promise<void>;
    /** Stop processing and remove the node from the graph. */
    destroy(): void;
}
export const WamNode: {
    prototype: WamNode;
    generateWamParameters(): WamParameterInfoMap;
    new (module: WebAudioModule, options?: AudioWorkletNodeOptions): WamNode;
};
export interface WamProcessor extends AudioWorkletProcessor {
    readonly moduleId: string;
    readonly instanceId: string;
    /** Compensation delay hint in seconds. */
    getCompensationDelay(): number;
    /** From the audio thread, schedule a WamEvent. Listeners will be triggered when the event is processed. */
    scheduleEvent(event: WamEvent): void;
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

export type WamListenerType = 'wam-event' | 'wam-automation' | 'wam-midi' | 'wam-sysex' | 'wam-mpe' | 'wam-osc';

export type WamEventType = keyof WamEventMap;

export interface WamEventBase<T extends WamEventType = WamEventType, D = any> {
    type: T;
    data: D;
    time?: number;
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
    "midi": WamMidiEvent;
    "sysex": WamSysexEvent;
    "mpe": WamMpeEvent;
    "osc": WamOscEvent;
}

export type WamEvent = WamAutomationEvent | WamMidiEvent | WamSysexEvent | WamMpeEvent | WamOscEvent;
export type WamAutomationEvent = WamEventBase<'automation', WamParameterData>;
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

export interface AudioWorkletGlobalScope {
    registerProcessor: (name: string, constructor: new (options: any) => AudioWorkletProcessor) => void;
    currentFrame: number;
    currentTime: number;
    sampleRate: number;
    AudioWorkletProcessor: typeof AudioWorkletProcessor;
}
