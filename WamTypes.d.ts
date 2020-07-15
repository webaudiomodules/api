/* eslint-disable max-len */
export interface WebAudioModule {
    /** The `AudioContext` where the plugin's node lives in */
    audioContext: BaseAudioContext;
    /** The `AudioNode` that handles audio in the plugin where the host can connect to/from */
    audioNode: WamNode;
    /** This will returns true after calling `initialize()`. */
    initialized: boolean;
    /** The unique identifier of the current WAM instance. */
    instanceId: string;
    /** The values from `descriptor.json` */
    readonly descriptor: WamDescriptor;
    /** The WAM's name */
    readonly name: string;
    /** The WAM Vendor's name */
    readonly vendor: string;
    /** Composed by vender + name */
    readonly processorId: string;

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
}
export const WebAudioModule: {
    prototype: WebAudioModule;
    isWebAudioModule: boolean;
    createInstance(audioContext: BaseAudioContext, initialState?: any): Promise<WebAudioModule>;
    descriptor: WamDescriptor;
    guiModuleUrl: string;
    new (audioContext: BaseAudioContext): WebAudioModule;
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
export interface WamAudioWorkletCommon {
}
export interface WamNode extends AudioWorkletNode, WamAudioWorkletCommon {
    readonly processorId: string;
    readonly instanceId: string;
    readonly module: WebAudioModule;

    /** Compensation delay hint in samples */
    getCompensationDelay(): Promise<number>;

    getParameterInfo(): Promise<WamParameterInfoMap>;
    getParameterInfo(parameterIdQuery: string): Promise<WamParameterInfoMap>;
    getParameterInfo(parameterIdQuery: string[]): Promise<WamParameterInfoMap>;

    getParameterValues(): Promise<WamParameterValueMap>;
    getParameterValues(normalized: boolean): Promise<WamParameterValueMap>;
    getParameterValues(normalized: boolean, parameterIdQuery: string): Promise<WamParameterValueMap>;
    getParameterValues(normalized: boolean, parameterIdQuery: string[]): Promise<WamParameterValueMap>;

    setParameterValues(parameterValues: WamParameterValueMap): Promise<void>;
    /** Returns a serializable that can be used to restore the WAM's state */
    getState(): any;
    /** Use a serializable to restore the WAM's state */
    setState(state: any): void;

    destroy(): void;

    addEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: WamNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener<K extends keyof WamEventMap>(type: K, listener: (this: WamNode, ev: WamEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: WamNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener<K extends keyof WamEventMap>(type: K, listener: (this: WamNode, ev: WamEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
export const WamNode: {
    prototype: WamNode;
    new (module: WebAudioModule, options?: AudioWorkletNodeOptions): WamNode;
};
export interface WamProcessor extends AudioWorkletProcessor, WamAudioWorkletCommon {
    readonly processorId: string;
    readonly instanceId: string;
    /** Compensation delay hint in samples */
    getCompensationDelay(): number;
    onEvent(event: WamEvent): void;
}
export const WamProcessor: {
    prototype: WamProcessor;
    generateWamParameterInfo(): WamParameterInfoMap;
    new (options: WamNodeOptions): WamProcessor;
};

// PARAMETERS

export type WamParameterType = 'float' | 'int' | 'boolean' | 'choice';

export interface WamParameterConfiguration {
    label?: string;
    type?: WamParameterType;
    defaultValue?: number;
    minValue?: number;
    maxValue?: number;
    discreteStep?: number;
    exponent?: number;
    choices?: string[];
    units?: string;
}

export interface WamParameterInfo extends Readonly<Required<WamParameterConfiguration>> {
    readonly id: string;
    normalize(value: number): number;
    denormalize(value: number): number;
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

export interface WamParameterValue {
    id: string;
    value: number;
    normalized: boolean;
}

export type WamParameterMap = Record<string, WamParameter>;

export type WamParameterInfoMap = Record<string, WamParameterInfo>;

export type WamParameterValueMap = Record<string, WamParameterValue>;

// EVENTS

export type WamEventType = keyof WamEventMap; // TODO 'sysex', 'mpe', 'osc'

interface WamEventDetailBase<T extends WamEventType = WamEventType> {
    type: T;
    time?: number;
}

export type WamEvent = CustomEvent<WamAutomationEventDetail | WamMidiEventDetail>;

export interface WamAutomationEventDetail extends WamEventDetailBase<'automation'> {
    parameterId: string;
    parameterValue: number;
}

export interface WamMidiEventDetail extends WamEventDetailBase<'midi'> {
    status: number;
    data1: number;
    data2: number;
}

export type WamEventCallback<E extends WamEventType = WamEventType> = (event: WamEventMap[E]) => any;

export interface WamEventMap {
    'midi': CustomEvent<WamMidiEventDetail>;
    'automation': CustomEvent<WamMidiEventDetail>;
    'sysex': CustomEvent<WamEventDetailBase>;
    'mpe': CustomEvent<WamEventDetailBase>;
    'osc': CustomEvent<WamEventDetailBase>;
}

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
