import {V2_0_0} from "./versions/v2.0.0-alpha2"

export interface WebAudioModule<Node extends WamNode = WamNode> extends V2_0_0.WebAudioModule {}
export interface WamDescriptor extends V2_0_0.WamDescriptor {}
export interface WamNodeOptions extends V2_0_0.WamNodeOptions{}
export interface WamNode extends V2_0_0.WamNode{}
export interface WamProcessor extends V2_0_0.WamProcessor{}
export interface WamParameterConfiguration extends V2_0_0.WamParameterConfiguration{}
export interface WamParameterInfo extends V2_0_0.WamParameterInfo{}
export interface WamParameter extends V2_0_0.WamParameter{}
export interface WamParameterData extends V2_0_0.WamParameterData{}
export interface WamEventBase<T extends WamEventType = WamEventType, D = any> extends V2_0_0.WamEventBase {}
export interface WamTransportData extends V2_0_0.WamTransportData{}

export interface WamMidiData extends V2_0_0.WamMidiData {}
export interface WamBinaryData extends V2_0_0.WamBinaryData{}
export interface WamInfoData extends V2_0_0.WamInfoData{}
export interface WamEventMap extends V2_0_0.WamEventMap{}
export interface AudioParamDescriptor extends V2_0_0.AudioParamDescriptor{}
export interface AudioWorkletProcessor extends V2_0_0.AudioWorkletProcessor{}
export interface WamEnv extends V2_0_0.WamEnv{}
export interface AudioWorkletGlobalScope extends V2_0_0.AudioWorkletGlobalScope{}

export type WamIODescriptor = V2_0_0.WamIODescriptor
export type WamParameterType = V2_0_0.WamParameterType
export type WamParameterMap = V2_0_0.WamParameterMap
export type WamParameterInfoMap = V2_0_0.WamParameterInfoMap
export type WamParameterDataMap = V2_0_0.WamParameterDataMap
export type WamEventType = V2_0_0.WamEventType

export type WamEventCallback<E extends WamEventType = WamEventType> = V2_0_0.WamEventCallback<E>
export type WamEvent = V2_0_0.WamEvent
export type WamAutomationEvent = V2_0_0.WamAutomationEvent
export type WamTransportEvent = V2_0_0.WamTransportEvent
export type WamMidiEvent = V2_0_0.WamMidiEvent
export type WamSysexEvent = V2_0_0.WamSysexEvent
export type WamMpeEvent = V2_0_0.WamMpeEvent
export type WamOscEvent = V2_0_0.WamOscEvent
export type WamInfoEvent = V2_0_0.WamInfoEvent


export const WebAudioModule: {
    prototype: WebAudioModule;
    /** should return `true` */
    isWebAudioModuleConstructor: boolean;
    /** shorthand for `new` then `initialize`. */
    createInstance<Node extends WamNode = WamNode>(audioContext: BaseAudioContext, initialState?: any): Promise<WebAudioModule<Node>>;
    /** WAM constructor, should call `initialize` after constructor to get it work */
    new <Node extends WamNode = WamNode>(audioContext: BaseAudioContext): WebAudioModule<Node>;
};

export const WamNode: {
    prototype: WamNode;
    new (module: WebAudioModule, options?: AudioWorkletNodeOptions): WamNode;
};
    
export const WamProcessor: {
    prototype: WamProcessor;
    new (options: AudioWorkletNodeOptions): WamProcessor;
} & Pick<typeof AudioWorkletProcessor, "parameterDescriptors">;

export const WamParameterInfo: {
    prototype: WamParameterInfo;
    new (id: string, config?: WamParameterConfiguration): WamParameterInfo;
};
    
export const WamParameter: {
    prototype: WamParameter;
    new (info: WamParameterInfo): WamParameter;
};

export const AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    parameterDescriptors: AudioParamDescriptor[];
    new (options: AudioWorkletNodeOptions): AudioWorkletProcessor;
};
    
export const WamEnv: {
    prototype: WamEnv;
    new (): WamEnv;
}