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
    /** The identifier of the current WAM's group. */
    readonly groupId: string;
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
    destroyGui(gui: Element): void;
}
export const WebAudioModule: {
    prototype: WebAudioModule;
    /** should return `true` */
    isWebAudioModuleConstructor: boolean;
    /** shorthand for `new` then `initialize`. */
    createInstance<Node extends WamNode = WamNode>(groupId: string, audioContext: BaseAudioContext, initialState?: any): Promise<WebAudioModule<Node>>;
    /** WAM constructor, should call `initialize` after constructor to get it work */
    new <Node extends WamNode = WamNode>(groupId: string, audioContext: BaseAudioContext): WebAudioModule<Node>;
};

export type WamIODescriptor = Record<`has${'Audio' | 'Midi' | 'Sysex' | 'Osc' | 'Mpe' | 'Automation'}${'Input' | 'Output'}`, boolean>;

export interface WamDescriptor extends WamIODescriptor {
    identifier: string;
    name: string;
    vendor: string;
    version: string;
    apiVersion: string;
    thumbnail: string;
    keywords: string[];
    isInstrument: boolean;
    description: string;
    website: string;
}

// Node

export interface WamNodeOptions {
    /** The identifier of the current WAM instance's `WamGroup`. */
    groupId: string;
    /** The identifier of the WAM's `AudioWorkletProcessor`. */
    moduleId: string;
    /** The identifier of the current WAM instance. */
    instanceId: string;
}
export interface WamNode extends AudioNode {
    /** Current `WebAudioModule`. */
    readonly module: WebAudioModule;

    readonly groupId: string;
    readonly moduleId: string;
    readonly instanceId: string;

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
    addEventListener<K extends keyof WamEventMap>(type: K, listener: (this: this | AudioWorkletNode, ev: CustomEvent<WamEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: (this: this | AudioWorkletNode, ev: CustomEvent) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    /** Deregister a callback function so it will no longer be called when matching events are processed. */
    removeEventListener<K extends keyof WamEventMap>(type: K, listener: (this: this | AudioWorkletNode, ev: CustomEvent<WamEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: (this: this | AudioWorkletNode, ev: CustomEvent) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    /** Schedule a WamEvent. Listeners will be triggered when the event is processed. */
    scheduleEvents(...event: WamEvent[]): void;
    /** Clear all pending WamEvents. */
    clearEvents(): void;
    /** Connect an event output stream to another WAM. If no output index is given, assume output 0. */
    connectEvents(toId: string, output?: number): void;
    /** Disconnect an event output stream from another WAM. If no arguments are given, all event streams will be disconnected. */
    disconnectEvents(toId?: string, output?: number): void;
    /** Stop processing and remove the node from the graph. */
    destroy(): void;
}
export const WamNode: {
    prototype: WamNode;
    new (module: WebAudioModule, options?: AudioWorkletNodeOptions): WamNode;
};
export interface WamProcessor extends AudioWorkletProcessor {
    readonly groupId: string;
    readonly moduleId: string;
    readonly instanceId: string;

    /** Compensation delay hint in seconds. */
    getCompensationDelay(): number;
    /** Schedule a WamEvent. Listeners will be triggered when the event is processed. */
    scheduleEvents(...event: WamEvent[]): void;
    /** Schedule events for all the downstream WAMs */
    emitEvents(...events: WamEvent[]): void;
    /** Clear all pending WamEvents. */
    clearEvents(): void;
    /** Process a block of samples. Note that `parameters` argument is ignored. */
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
    /** Stop processing and remove the node from the WAM event graph. */
    destroy(): void;
}
export const WamProcessor: {
    prototype: WamProcessor;
    new (options: AudioWorkletNodeOptions): WamProcessor;
} & Pick<typeof AudioWorkletProcessor, "parameterDescriptors">;

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
    /** Determines if transport is active */
    playing: boolean;
}

export interface WamMidiData {
    bytes: [number, number, number];
}

export interface WamBinaryData {
    bytes: Uint8Array;
}

export interface WamInfoData {
    instanceId: string;
}

export type WamEventCallback<E extends WamEventType = WamEventType> = (event: WamEventMap[E]) => any;

export interface WamEventMap {
    'wam-automation': WamAutomationEvent;
    'wam-transport': WamTransportEvent;
    'wam-midi': WamMidiEvent;
    'wam-sysex': WamSysexEvent;
    'wam-mpe': WamMpeEvent;
    'wam-osc': WamOscEvent;
    'wam-info': WamInfoEvent;
}

export type WamEvent = WamAutomationEvent | WamTransportEvent | WamMidiEvent | WamSysexEvent | WamMpeEvent | WamOscEvent | WamInfoEvent;
export type WamAutomationEvent = WamEventBase<'wam-automation', WamParameterData>;
export type WamTransportEvent = WamEventBase<'wam-transport', WamTransportData>;
export type WamMidiEvent = WamEventBase<'wam-midi', WamMidiData>;
export type WamSysexEvent = WamEventBase<'wam-sysex', WamBinaryData>;
export type WamMpeEvent = WamEventBase<'wam-mpe', WamMidiData>;
export type WamOscEvent = WamEventBase<'wam-osc', WamBinaryData>;
export type WamInfoEvent = WamEventBase<'wam-info', WamInfoData>;

export interface AudioParamDescriptor {
    automationRate?: AutomationRate;
    defaultValue?: number;
    maxValue?: number;
    minValue?: number;
    name: string;
}
export interface AudioWorkletProcessor {
    port: MessagePort;
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
export const AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    parameterDescriptors: AudioParamDescriptor[];
    new (): AudioWorkletProcessor;
};

export interface WamGroup {
    /** The group's unique identifier. */
    readonly groupId: string;

    /** Used to control access to the group instance via `WamEnv`. */
    validate(groupKey: string): boolean;
    /** Add the WAM to the group. */
    addWam(wam: WamProcessor): void;
    /** Remove the WAM from the group. */
    removeWam(wam: WamProcessor): void;
    /** Connect events between `WamProcessor`s, the output number is 0 by default. 'from' and 'to' must both be members of this group. */
    connectEvents(fromId: string, toId: string, output?: number): void;
    /** Disonnect events between `WamProcessor`s, the output number is 0 by default, if `toId` is omitted, will disconnect every connections. 'from' and 'to' must both be members of this group. */
    disconnectEvents(fromId: string, toId?: string, output?: number): void;
    /** Pass events from `WamProcessor` to other `WamProcessor`s connected downstream within this group. */
    emitEvents(from: WamProcessor, ...events: WamEvent[]): void;
}

export const WamGroup: {
    prototype: WamGroup;
    new (groupId: string, groupKey: string): WamGroup;
}

export interface WamEnv {
    /** The version of the API used */
    readonly apiVersion: string;

    /** Return the WAM's 'global scope' including any dependencies. */
    getModuleScope(moduleId: string): Record<string, any>;
    /** Return specified WamGroup */
    getGroup(groupId: string, groupKey: string): WamGroup;
    /** The method should be called when a group is created */
    addGroup(group: WamGroup): void;
    /** The method should be called before a group is destroyed */
    removeGroup(group: WamGroup): void;
    /** The method should be called when a processor instance is created */
    addWam(wam: WamProcessor): void;
    /** The method should be called before a processor instance is destroyed */
    removeWam(wam: WamProcessor): void;
    /** Connect events between `WamProcessor`s, the output number is 0 by default */
    connectEvents(groupId: string, fromId: string, toId: string, output?: number): void;
    /** Disonnect events between `WamProcessor`s, the output number is 0 by default, if `toId` is omitted, will disconnect every connections */
    disconnectEvents(groupId: string, fromId: string, toId?: string, output?: number): void;
    /** Pass events from `WamProcessor` to other `WamProcessor`s connected downstream*/
    emitEvents(from: WamProcessor, ...events: WamEvent[]): any;
}

export const WamEnv: {
    prototype: WamEnv;
    new (): WamEnv;
}

export interface AudioWorkletGlobalScope {
    AudioWorkletGlobalScope: any;
    globalThis: AudioWorkletGlobalScope;
    registerProcessor: (name: string, constructor: new (options?: any) => AudioWorkletProcessor) => void;
    currentFrame: number;
    currentTime: number;
    sampleRate: number;
    AudioWorkletProcessor: typeof AudioWorkletProcessor;
    webAudioModules: WamEnv;
}
