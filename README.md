# WebAudioModules API

This repository includes API definition files for WebAudioModules (WAMs) written in TypeScript and abstract classes that conform to the API written in JavaScript. The API is designed for making web-based modular audio plugins and using them in compatible hosts.

The legacy WAM API is available in branch [v10](https://github.com/webaudiomodules/api/tree/v10).

## Installing the API

```Bash
npm i -D @webaudiomodules/api
```

## API definitions

The WAM API provides a specification which should be implemented in each WAM plugin or host. All the interfaces and types in the specification are documented in TypeScript in `src/types.d.ts`.

Similar to the VST, AudioUnit or AAX standards supported by desktop DAWs, WAMs are modular audio plugins which include a DSP component and a UI component along with some extra features such as parameter automation, MIDI message processing, and state saving/loading, etc. Plugins and hosts which conform to the standard defined by the API are guaranteed to be compatible, regardless of their underlying implementations.

> VSCode IntelliSense will take the types into account by using JSDoc or TypeScript import. For example:
```JavaScript
// JavaScript
/** @typedef {import('@webaudiomodules/api').WamEvent} IWamEvent */
```
```TypeScript
// TypeScript
import { WamEvent } from '@webaudiomodules/api';
```

### Features

The API supports these primary features:

- Getting information about the WAM by fetching a JSON file.

- Getting the WAM plugin constructor by fetching an ECMAScript Module file.

- Getting a WebAudio `AudioNode` that can be inserted into an existing audio graph.

- Saving and restoring the plugin's state.

- Getting parameter information from both main thread and audio thread (via `AudioWorklet`).

- Scheduling automation events of plugin parameters from both threads.

- Scheduling transport, MIDI, and OSC events from both threads.

- Managing event connections between WAM plugins.

- Emitting events to downstream WAM plugins.

- Cleaning up when the plugin instance is destroyed.

- Facilitating an alternative to `import` statements on the audio thread.

- Allowing hosts to directly access plugin processor instances on the audio thread.

### API Overview

The interfaces defined are: 

- `WebAudioModule`, which is the main entry point of a WAM plugin instance.

- `WamDescriptor`, which contains general information about the plugin.

- `WamNode`, which extends WebAudio's `AudioNode` and can be inserted into the host's audio graph.

- `WamProcessor`, which extends WebAudio's `AudioWorkletProcessor` and processes signals in the audio thread.

- `WamParameterInfo`, which provides parameter metadata and convenience methods.

- `WamParameter`, which provides parameter state information.

- `WamEvent`, which provides information for scheduling or emitting WAM related events like automation or MIDI messages.

- `WamGroup`, which maintains graph information for hosts and sub-hosts on the audio thead.

- `WamEnv`, which manages `WamGroup`s, registers `WamProcessor`s, and stores plugin dependencies on the audio thread.

### WebAudioModule interface

A WAM distribution should include at least a JSON descriptor file and a JavaScript file that exports by default a `WebAudioModule` constructor. The constructor should provide statically:

- `isWebAudioModuleConstructor` getter that returns `true`.

- `createInstance` method that asynchronously instantiates the WebAudioModule.

    > This method is a short hand for calling the constructor then the `initialize` method, and should return a Promise that resolves the `WebAudioModule` constructed and initialized.
    
- the `new` constructor.

    > The WAM instance constructed by the `new` operator is only usable after calling `initialize` method.

After importing the default export from the ESM module, the host can first do a type check using the `isWebAudioModuleConstructor` getter, then construct the WAM instance using the `createInstance` method. The following example demonstrates the steps required for a host to create a WAM using the [WAM SDK](https://github.com/webaudiomodules/sdk):

```JavaScript
/** @typedef {typeof import('@webaudiomodules/api').WebAudioModule} WebAudioModuleConstructor */
(async () => {
    const audioCtx = new AudioContext();
    // Init WamEnv
    const { VERSION: apiVersion } = await import("@webaudiomodules/api");
    const { addFunctionModule, initializeWamEnv, initializeWamGroup } = await import("@webaudiomodules/sdk");
    await addFunctionModule(audioContext.audioWorklet, initializeWamEnv, apiVersion);
	const hostGroupId = 'example-host'; // will be known by host's WAMs
	const hostGroupKey = performance.now().toString(); // should be kept secret from host's WAMs
	await addFunctionModule(audioContext.audioWorklet, initializeWamGroup, hostGroupId, hostGroupKey);

    // Init WAM
    const initialState = {};
    const imported = await import('./path_to_wam/index.js');
    /** @type {WebAudioModuleConstructor} */
    const WAM = imported.default;
    const isWAM = typeof WAM === 'function' && WAM.isWebAudioModuleConstructor;
    if (!isWAM) return;
    const wam = await WAM.createInstance(audioCtx, initialState);
    return wam;
})();
```

Here, 
```JavaScript
const wam = await WAM.createInstance(audioCtx, initialState);
```
is equivalent to 

```JavaScript
const wam = new WAM(audioCtx);
await wam.initialize(initialState);
```

The following getters and methods should also be implemented.

- `isWebAudioModule` getter that returns `true`.

- `audioContext` getter that returns the current `BaseAudioContext` the WAM belongs to.

- `audioNode` getter that returns the `AudioNode` to be inserted into an audio graph.

- `initialized` getter that returns `false` before initialized, and `true` after.

- `groupId` getter that returns an identifier for the WAM instance's `WamGroup`.

- `moduleId` getter that returns an identifier for the WAM, usually composed by its vender + its name.

- `instanceId` getter that returns the unique identifier for the WAM instance.

- `descriptor` getter that returns a `WamDescriptor` containing the same information found in the WAM's JSON file.

- `name` getter that returns the WAM's name.

- `vendor` getter that returns the WAM vendor's name.

- `createAudioNode` method that asynchronously instantiates an `AudioNode` (which may or may not be a `Wamnode` which will be inserted into the host's audio graph. 

- `initialize` method that asynchronously initializes the newly constructed WAM and creates its `AudioNode` via `createAudioNode`. After initialization, the WAM will be ready to connect its `AudioNode` to the host's audio graph.

- `createGui` method that asynchronously creates an `Element` containing the WAM's GUI which can be attached to the HTML Document.

    > There could be multiple GUIs controlling the same WAM, for example if the host generates its own controls to adjust plugin parameters. Make sure the WAM's primary GUI can both control the WAM and responding to any state changes that might occur via interactions with the host.

- `destroyGui` method that cleans up the WAM's existing but no longer useful GUI element created via `createGui`.

For example, a host can get and append to the document the WAM's GUI by doing following:

```JavaScript
(async () => {
    const container = document.getElementById('wam-container');
    const wamGui = await wam.createGui();
    container.appendChild(wamGui);
})();
```

and remove it by:

```JavaScript
wamGui.remove();
wam.destroyGui(wamGui);
```

To connect an initialized WAM to an audio graph:

```JavaScript
(async () => {
    const defaultConstraints = {
        audio: {
            echoCancellation: false,
            mozNoiseSuppression: false,
            mozAutoGainControl: false,
        },
    };
    const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints);
    const inputNode = audioCtx.createMediaStreamSource(stream);

    const { audioNode } = wam;
    inputNode.connect(audioNode);
    audioNode.connect(audioCtx.destination);
})();
```

### WamDescriptor interface

The WAM descriptor contains information that can be used by the host to properly categorize, display, and load a WAM. The `WamDescriptor` interface is an object used in the WAM's descriptor JSON file and in its instance's `descriptor` property. It has the following fields:

- `name`: the WAM's name.
- `vendor`: the WAM vendor's name.
- `version`: the WAM's version (string).
- `apiVersion`: the WAM API version used (string).
- `thumbnail`: a URL containing an image for the WAM's thumbnail.
- `keywords`: an array of keyword strings.
- `isInstrument`: `true` if the WAM is a MIDI instrument (boolean).
- `description`: text describing the behavior of the WAM.
- `website`: a URL of the WAM's development website.

The `WamDescriptor` also contains a set of boolean properties indicating the WAM's IO support. They are optional in the descriptor JSON, but mandatory in the `descriptor` getter under the `WebAudioModule` interface. These properties will affect the WAM's behavior in the host when it receives audio or events from upstream WAMs.

- `hasAudioInput`
- `hasAudioOutput`
- `hasMidiInput`
- `hasMidiOutput`
- `hasAutomationInput`
- `hasAutomationOutput`
- `hasMpeInput`
- `hasMpeOutput`
- `hasOscInput`
- `hasOscOutput`
- `hasSysexInput`
- `hasSysexOutput`

### WamNode interface
`WamNode` extends WebAudio's `AudioNode`. Instances are accessed via the `audioNode` getter under the `WebAudioModule` interface. 

A WAM host will use its native (or overridden) [`connect`](https://www.w3.org/TR/webaudio/#dom-audionode-connect) and [`disconnect`](https://www.w3.org/TR/webaudio/#dom-audionode-disconnect) methods to run its underlying DSP in an audio graph. The `WamNode` can also be the destination node of any `AudioNode` connection.

It has following getters and methods:

- `module` getter: returns the WAM instance's corresponding `WebAudioModule` object.
- `groupId` getter: returns the WAM instance's `WamGroup` identifier.
- `moduleId` getter: returns the WAM instance's `WebAudioModule` identifier.
- `instanceId` getter: returns the WAM instance's unique identifier. 

Lifecycle related:

- `destroy`: This method should be called by the host before removing the `WamNode` from the audio graph. The WAM developer could perform some clean up by overriding this method, for example removing event listeners or closing `AudioWorklet` message port.

State related:

A state object can be any serializable type and should contain all information required to fully save or restore a WAM. 

- `getState`
- `setState`

```JavaScript
(async () => {
    const currentState = await wamNode.getState();
    await wamNode.setState(currentState);
})();
```

Parameter related:

Most WAMs have one or more parameters that allow the user to alter the behavior of the plugin. Note that a WAM parameter is different from WebAudio `AudioParam`s, which are ignored in the WAM API. To schedule WAM parameter automation the host should instead use `scheduleEvents`.

- `getParameterInfo`
- `getParameterValues`
- `setParameterValues`

The methods above are available on the main thread and should not be used in time-critical situations.

Event related:

- `scheduleEvents`: schedule one or more WAM events, optionally with timestamps such that they occur at specific times in the future relative to the clock referenced by `AudioContext.currentTime`.
- `clearEvents`: remove all pending events.

WAM events can contain parameter changes, MIDI events, etc. To allow a WAM to send events to other WAMs the host can call following methods:

- `connectEvents`
- `disconnectEvents`

Though initiated on the main thread, ultimately the connections must be handled in the audio thread by calling `webAudioModules.connectEvents` or `webAudioModules.disconnectEvents`. Events without timestamps will be processed 'ASAP' while those with timestamps will be processed at the specified time in the future. Interested parties such as hosts or WAM GUIs can be notified when an event is processed via `addEventListener`.

Processing related:

- `getCompensationDelay`: The host can get a compensation delay hint value in samples. The value is not measured by the host but provided by the WAM developer and should take into account internal delay incurred by the processor.

### WamProcessor interface

Each WAM plugin should implement the `WamProcessor` interface on the audio thread. The interface extends WebAudio's `AudioWorkletProcessor` and is instantiated by a `WamNode`. On the audio thread, the processor can access the `WamEnv` interface under `globalThis.webAudioModules`. When the processor is created, it should call `webAudioModules.addWam` to register itself with the `WamEnv`.

`WamProcessor` has the following getters and methods:

The following getters and methods mirror the `WamNode` interface, providing the same functionality on the audio thread:

- `groupId`
- `moduleId`
- `instanceId` 
- `getCompensationDelay`
- `scheduleEvents`
- `clearEvents`
- `destroy` (should call `webAudioModules.removeWam`)

Event related:

- `emitEvents` can be used to pass any event to downstream WAMs in the same `WamGroup`.

### WamGroup interface

Hosts and WAMs which act as sub-hosts (such as 'pedalboard' type plugins) must register a `WamGroup` with the `WamEnv` in order to manage `WamProcessor`s and facilitate `WamEvent` connections on the audio thread. 

After initializing the `WamEnv`, hosts must also initialize a `WamGroup` before creating any WAM instances. Registering a `WamGroup` requires both a `groupId` and a `groupKey`. The former will be shared with all plugins the host (or sub-host) creates via the `WebAudioModule` constructor or `createInstance` method, thus facilitating those WAMs' interactions with the `WamEnv`. The latter should be kept 'secret' to prevent any entity other than the host/sub-host from gaining access to a reference to the `WamGroup` instance via `WamEnv`'s `getGroup` method. 

`WamGroup`s make it possible for there to be multiple hosts sharing the same `AudioContext`. WAMs will not interact directly with their `WamGroup`s -- these interactions are instead mediated by the `WamEnv`. This is meant to ensure that WAMs are 'sandboxed' within a `WamGroup`, thus facilitating the creation of sub-host WAMs which can manage and have privileged access to a sub-graph composed of its child WAMs while preventing them from accessing other WAMs belonging to the primary host. Therefore a sub-host WAM's `groupId` will be that of the primary host, while the `groupId` of any plugins the sub-host creates will be a different ID corresponding to the sub-host's own `WamGroup`.

`WamGroup` has the following getters and methods:

- `groupId` getter: returns the `WamGroup`'s unique identifier.

- `validate`: returns a boolean indicating whether or not the specified `groupKey` matches that used to initialize the `WamGroup`. This is meant to be used by `WamEnv` to control access to `WamGroup` instances via its `getGroup` method. 

- `addWam`: registers a `WamProcessor` with the group.

- `removeWam`: deregisters a `WamProcessor` from the group.

- `connectEvents`: establishes a `WamEvent` connection between two plugins within the group.

- `disconnectEvents`: breaks a `WamEvent` connection between two plugins within the group.

- `emitEvents`: allows a `WamProcessor` to send events to any downstream WAMs to which it is connected within the group.

### WamEnv interface

The host application must initialize the `WamEnv` and then initialize a `WamGroup` before any WAMs can be instantiated. The `WamEnv` is a global singleton which facilitates WAM functionality on the audio thread. `WamEnv` manages `WamGroup` instances and acts as an intermediary between `WamProcessors` and their corresponding `WamGroup`s when adding/removing `WamProcessor`s or connecting/disconnecting/emitting `WamEvent`s. It also allows WAMs to access code on the audio thread as an alternative to `import` statements, which should not be used in audio thread code. 

`WamEnv` has the following getters and methods:

- `apiVersion` getter: returns a string specifying the API version implemented by the `WamEnv`.

- `getModuleScope`: returns an object which acts as the WAM's 'global scope' on the audio thread. This object can be used as an alternative to `import` statements in `WamProcessor` code in order to access dependencies on the audio thread.

- `getGroup`: allows host to access its `WamGroup` on the audio thread using its `groupId` and `groupKey`.

- `addGroup`: registers a `WamGroup` with the `WamEnv`. 

- `removeGroup`: deregisters a `WamGroup` from the `WamEnv`. 

Since parent `WamGroup`s are not directly accessible by `WamProcessor`s, the following proxy methods are provided with an additional `groupId` argument:

- `addWam`
- `removeWam`
- `connectEvents`
- `disconnectEvents`
- `emitEvents`



