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
    readonly pluginId: string;
    // RSH: rename to moduleId ?

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
    // RSH: We don't need loadGui
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

// PLUGIN

export interface WamNodeFunctionMap {
    getParameterInfo(parameterIdQuery?: string | string[]): WamParameterInfoMap;
    getParameterValues(normalized?: boolean, parameterIdQuery?: string | string[]): WamParameterValueMap;
    setParameterValues(parameterUpdates: WamParameterValueMap): void;
    /** Returns a serializable that can be used to restore the WAM's state */
    getState(): any;
    /** Use a serializable to restore the WAM's state */
    setState(state: any): void;
    // RSH: why not put getState/setState in WebAudioModule interface?
    /** Compensation delay hint in samples */
    getCompensationDelay(): number;
    destroy(): void;
}
export type PromisifiedFunctionMap<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? (...args: Parameters<T[K]>) => PromiseLike<ReturnType<T[K]>> | ReturnType<T[K]> : T[K];
};
export interface MessagePortRequest<M = Record<string, (...args: any[]) => any>, K extends keyof M = any> {
    id: number;
    call: K;
    args?: M[K] extends (...args: any[]) => any ? Parameters<M[K]> : M[K];
}
export interface MessagePortResponse<M = Record<string, any>, K extends keyof M = any> {
    id: number;
    value?: M[K] extends (...args: any[]) => any ? ReturnType<M[K]> : M[K];
    error?: Error;
}
export interface MessagePortBidirectionalRequest<M = Record<string, any>, K extends keyof M = any> {
    id: number;
    call?: K;
    args?: M[K] extends (...args: any[]) => any ? Parameters<M[K]> : M[K];
    value?: M[K] extends (...args: any[]) => any ? ReturnType<M[K]> : M[K];
    error?: Error;
}
export type WamMessagePortData = MessagePortBidirectionalRequest<WamNodeFunctionMap, keyof WamNodeFunctionMap>;
export type IWamNode = PromisifiedFunctionMap<WamNodeFunctionMap>;
export type WamNodeOptions = TypedAudioWorkletNodeOptions<{ processorId: string; instanceId: string }>;

export interface WamNode extends AudioWorkletNode, IWamNode {
    readonly processorId: string;
    readonly instanceId: string;
    readonly module: WebAudioModule;
    
    addEventCallback<E extends WamEventType>(subscriberId: E, callback: WamEventCallback<E>): boolean;
    removeEventCallback(subscriberId: string): boolean;
    onEvent(event: WamEvent): void;
    onMessage(message: MessageEvent): void;
    // RSH: Is it better to use EventTarget's methods? AudioNode already supports that.
}
export const WamNode: {
    prototype: WamNode;
    new (audioContext: BaseAudioContext, processorId: string, instanceId: string, module: WebAudioModule, options: WamNodeOptions): WamNode;
    // RSH: module already contains audioContext, processorId and instanceId
};

export interface WamProcessor extends AudioWorkletProcessor<Partial<WamMessagePortData> & Record<string, any>, Partial<WamMessagePortData> & Record<string, any>>, IWamNode {
    readonly processorId: string;
    readonly instanceId: string;
    getCompensationDelay(): number;
    onEvent(event: WamEvent): void;
    onMessage(message: MessageEvent): void;
    destroy(): void;
}
export const WamProcessor: {
    prototype: WamProcessor;
    generateWamParameterInfo(): WamParameterInfoMap;
    new (options: WamNodeOptions): WamProcessor;
};

// PARAMETERS

export type WamParameterType = "float" | "int" | "boolean" | "choice";

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
    readonly id: string;
    readonly info: WamParameterInfo;
    value: number;
    normalizedValue: boolean;
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

interface WamEventBase<T extends WamEventType = WamEventType> {
    type: T;
    time?: number;
}

export type WamEvent = WamAutomationEvent | WamMidiEvent;

export interface WamAutomationEvent extends WamEventBase<"automation"> {
    parameterId: string;
    parameterValue: number;
}

export interface WamMidiEvent extends WamEventBase<"midi"> {
    status: number;
    data1: number;
    data2: number;
}

export type WamEventCallback<E extends WamEventType = WamEventType> = (event: WamEventMap[E]) => any;

export interface WamEventMap {
    "midi": WamMidiEvent;
    "automation": WamMidiEvent;
    "sysex": WamEventBase;
    "mpe": WamEventBase;
    "osc": WamEventBase;
}

// AudioWorkletProcessor

export interface TypedAudioWorkletNodeOptions<T extends any = any> extends AudioWorkletNodeOptions {
    processorOptions?: T;
}
export interface AudioWorkletMessageEvent<T extends any = any> extends MessageEvent {
    data: T;
}
export interface AudioWorkletMessagePort<I extends Record<string, any> = Record<string, any>, O extends Record<string, any> = Record<string, any>> extends MessagePort {
    onmessage: ((this: AudioWorkletMessagePort<I, O>, ev: AudioWorkletMessageEvent<I>) => any) | null;
    onmessageerror: ((this: AudioWorkletMessagePort<I, O>, ev: AudioWorkletMessageEvent<I>) => any) | null;
    postMessage(message: O, transfer: Transferable[]): void;
    postMessage(message: O, options?: PostMessageOptions): void;
}
export interface TypedAudioParamDescriptor<P extends string = string> extends AudioParamDescriptor {
    automationRate?: AutomationRate;
    defaultValue?: number;
    maxValue?: number;
    minValue?: number;
    name: P;
}
export interface AudioWorkletProcessor<I extends Record<string, any> = Record<string, any>, O extends Record<string, any> = Record<string, any>, P extends string = string> {
    port: AudioWorkletMessagePort<I, O>;
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<P, Float32Array>): boolean;
}
export const AudioWorkletProcessor: {
    parameterDescriptors: TypedAudioParamDescriptor[];
    new <I extends Record<string, any> = Record<string, any>, O extends Record<string, any> = Record<string, any>, P extends string = string, Opt extends any = any>(options: TypedAudioWorkletNodeOptions<Opt>): AudioWorkletProcessor<I, O, P>;
};

export interface AudioWorkletGlobalScope {
    registerProcessor: (name: string, constructor: new (options: any) => AudioWorkletProcessor) => void;
    currentFrame: number;
    currentTime: number;
    sampleRate: number;
    AudioWorkletProcessor: typeof AudioWorkletProcessor;
}
