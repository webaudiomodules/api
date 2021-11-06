// src/AbstractWamEnv.js
var WamEnv = class {
  get apiVersion() {
    throw new Error("Not Implemented.");
    return null;
  }
  get eventGraph() {
    throw new Error("Not Implemented.");
    return null;
  }
  get processors() {
    throw new Error("Not Implemented.");
    return null;
  }
  create(wam) {
    throw new Error("Not Implemented.");
    return null;
  }
  connectEvents(from, output, to) {
    throw new Error("Not Implemented.");
    return null;
  }
  disconnectEvents(from, output, to) {
    throw new Error("Not Implemented.");
    return null;
  }
  destroy(wam) {
    throw new Error("Not Implemented.");
    return null;
  }
};

// src/AbstractWamNode.js
var WamNode = class extends AudioWorkletNode {
  constructor(module, options) {
    super(module.audioContext, module.moduleId, options);
  }
  get processorId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get instanceId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get module() {
    throw new Error("Not Implemented.");
    return null;
  }
  async getCompensationDelay() {
    throw new Error("Not Implemented.");
    return null;
  }
  async getParameterInfo(...parameterIdQuery) {
    throw new Error("Not Implemented.");
    return null;
  }
  async getParameterValues(normalized, ...parameterIdQuery) {
    throw new Error("Not Implemented.");
    return null;
  }
  async setParameterValues(parameterValues) {
    throw new Error("Not Implemented.");
  }
  async getState() {
    throw new Error("Not Implemented.");
    return null;
  }
  async setState(state) {
    throw new Error("Not Implemented.");
  }
  scheduleEvents(...events) {
    throw new Error("Not Implemented.");
  }
  async clearEvents() {
    throw new Error("Not Implemented.");
  }
  connectEvents(to, output) {
    throw new Error("Not Implemented.");
  }
  disconnectEvents(to, output) {
    throw new Error("Not Implemented.");
  }
  destroy() {
    throw new Error("Not Implemented.");
  }
};

// src/AbstractWamParameter.js
var WamParameter = class {
  constructor(info) {
  }
  get info() {
    throw new Error("Not Implemented.");
    return null;
  }
  get value() {
    throw new Error("Not Implemented.");
    return null;
  }
  set value(value) {
    throw new Error("Not Implemented.");
  }
  get normalizedValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  set normalizedValue(normalizedValue) {
    throw new Error("Not Implemented.");
  }
};

// src/AbstractWamParameterInfo.js
var WamParameterInfo = class {
  constructor(id, config) {
  }
  get id() {
    throw new Error("Not Implemented.");
    return null;
  }
  get label() {
    throw new Error("Not Implemented.");
    return null;
  }
  get type() {
    throw new Error("Not Implemented.");
    return null;
  }
  get defaultValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  get minValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  get maxValue() {
    throw new Error("Not Implemented.");
    return null;
  }
  get discreteStep() {
    throw new Error("Not Implemented.");
    return null;
  }
  get exponent() {
    throw new Error("Not Implemented.");
    return null;
  }
  get choices() {
    throw new Error("Not Implemented.");
    return null;
  }
  get units() {
    throw new Error("Not Implemented.");
    return null;
  }
  normalize(value) {
    throw new Error("Not Implemented.");
    return null;
  }
  denormalize(value) {
    throw new Error("Not Implemented.");
    return null;
  }
  valueString(value) {
    throw new Error("Not Implemented.");
    return null;
  }
};

// src/AbstractWamProcessor.js
var AudioWorkletProcessor = globalThis.AudioWorkletProcessor;
var WamProcessor = class extends AudioWorkletProcessor {
  get moduleId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get instanceId() {
    throw new Error("Not Implemented.");
    return null;
  }
  getCompensationDelay() {
    throw new Error("Not Implemented.");
    return null;
  }
  scheduleEvents(...events) {
    throw new Error("Not Implemented.");
  }
  emitEvents(...events) {
    throw new Error("Not Implemented.");
  }
  clearEvents() {
    throw new Error("Not Implemented.");
  }
  destroy() {
    throw new Error("Not Implemented.");
  }
};

// src/AbstractWebAudioModule.js
var WebAudioModule = class {
  static get isWebAudioModuleConstructor() {
    throw new Error("Not Implemented.");
    return null;
  }
  static async createInstance(audioContext, initialState) {
    throw new Error("Not Implemented.");
    return null;
  }
  constructor(audioContext) {
  }
  get isWebAudioModule() {
    throw new Error("Not Implemented.");
    return null;
  }
  get audioContext() {
    throw new Error("Not Implemented.");
    return null;
  }
  set audioContext(audioContext) {
    throw new Error("Not Implemented.");
  }
  get audioNode() {
    throw new Error("Not Implemented.");
    return null;
  }
  set audioNode(audioNode) {
    throw new Error("Not Implemented.");
  }
  get initialized() {
    throw new Error("Not Implemented.");
    return null;
  }
  set initialized(initialized) {
    throw new Error("Not Implemented.");
  }
  get moduleId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get instanceId() {
    throw new Error("Not Implemented.");
    return null;
  }
  set instanceId(instanceId) {
    throw new Error("Not Implemented.");
  }
  get descriptor() {
    throw new Error("Not Implemented.");
    return null;
  }
  get name() {
    throw new Error("Not Implemented.");
    return null;
  }
  get vendor() {
    throw new Error("Not Implemented.");
    return null;
  }
  async initialize(state) {
    throw new Error("Not Implemented.");
    return null;
  }
  async createAudioNode(initialState) {
    throw new Error("Not Implemented.");
    return null;
  }
  async createGui() {
    throw new Error("Not Implemented.");
    return null;
  }
  destroyGui(gui) {
    throw new Error("Not Implemented.");
  }
};

// src/version.js
var version_default = "2.0.0-alpha.2";
export {
  WamEnv as AbstractWamEnv,
  WamNode as AbstractWamNode,
  WamParameter as AbstractWamParameter,
  WamParameterInfo as AbstractWamParameterInfo,
  WamProcessor as AbstractWamProcessor,
  WebAudioModule as AbstractWebAudioModule,
  version_default as VERSION
};
//# sourceMappingURL=index.js.map
