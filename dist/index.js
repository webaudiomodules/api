// src/AbstractWamEnv.js
var getWamEnv = (apiVersion) => {
  class WamEnv {
    get apiVersion() {
      throw new Error("Not Implemented.");
      return null;
    }
    getModuleScope(moduleId) {
      throw new Error("Not Implemented.");
      return null;
    }
    getGroup(groupId, groupKey) {
      throw new Error("Not Implemented.");
      return null;
    }
    addGroup(group) {
      throw new Error("Not Implemented.");
      return null;
    }
    removeGroup(group) {
      throw new Error("Not Implemented.");
      return null;
    }
    addWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    removeWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    connectEvents(groupId, fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    disconnectEvents(groupId, fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    emitEvents(from, ...events) {
      throw new Error("Not Implemented.");
      return null;
    }
  }
  return WamEnv;
};
var AbstractWamEnv_default = getWamEnv;

// src/AbstractWamGroup.js
var initializeWamGroup = (groupId, groupKey) => {
  class WamGroup {
    get groupId() {
      throw new Error("Not Implemented.");
      return null;
    }
    validate(groupKey2) {
      throw new Error("Not Implemented.");
      return null;
    }
    addWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    removeWam(wam) {
      throw new Error("Not Implemented.");
      return null;
    }
    connectEvents(fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    disconnectEvents(fromId, toId, output) {
      throw new Error("Not Implemented.");
      return null;
    }
    emitEvents(from, ...events) {
      throw new Error("Not Implemented.");
      return null;
    }
  }
  return WamGroup;
};
var AbstractWamGroup_default = initializeWamGroup;

// src/AbstractWamNode.js
var WamNode = class extends AudioWorkletNode {
  constructor(module, options) {
    super(module.audioContext, module.moduleId, options);
  }
  get groupId() {
    throw new Error("Not Implemented.");
    return null;
  }
  get moduleId() {
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
  connectEvents(toId, output) {
    throw new Error("Not Implemented.");
  }
  disconnectEvents(toId, output) {
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
var getWamProcessor = (moduleId) => {
  const { AudioWorkletProcessor } = globalThis;
  class WamProcessor extends AudioWorkletProcessor {
    get groupId() {
      throw new Error("Not Implemented.");
      return null;
    }
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
  }
  return WamProcessor;
};
var AbstractWamProcessor_default = getWamProcessor;

// src/AbstractWebAudioModule.js
var WebAudioModule = class {
  static get isWebAudioModuleConstructor() {
    throw new Error("Not Implemented.");
    return null;
  }
  static async createInstance(groupId, audioContext, initialState) {
    throw new Error("Not Implemented.");
    return null;
  }
  constructor(groupId, audioContext) {
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
  get groupId() {
    throw new Error("Not Implemented.");
    return null;
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
  get identifier() {
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
var version_default = "2.0.0-alpha.5";
export {
  WamNode as AbstractWamNode,
  WamParameter as AbstractWamParameter,
  WamParameterInfo as AbstractWamParameterInfo,
  WebAudioModule as AbstractWebAudioModule,
  version_default as VERSION,
  AbstractWamEnv_default as getAbstractWamEnv,
  AbstractWamGroup_default as getAbstractWamGroup,
  AbstractWamProcessor_default as getAbstractWamProcessor
};
//# sourceMappingURL=index.js.map
