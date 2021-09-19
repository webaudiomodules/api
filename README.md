# WebAudioModules API

The repository includes API definition files for WebAudioModules (WAM) written in TypeScript, abstract classes that conforms the API written in JavaScript, and different implementations and utilities that can be used in WAM projects.

## Installing the API

```Bash
npm i -D @webaudiomodules/api
```

## API definitions

The WAM API is considered as the plugin specification that should be implemented in each WAM. All the interfaces and types in the specification are described in TypeScript language in `src/types.d.ts`.

The API is designed for making Web-based audio plugins (WAMs) and using them in the hosts. As the VST, AudioUnit or AAX standards on the desktop DAWs, audio plugins usually includes an insertable DSP and an UI on the given platform along with some extra features such as parameter automations, MIDI message processing, state saving and loading, etc. These features' interface are standardized in the API for audio plugin and host developers.

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

- Getting the WAM's information by fetching a JSON file.

- Loading the WAM plugin constructor by fetching an ECMAScript Module file.

- Getting a WebAudio AudioNode-compatible processor that can be inserted into an existing audio graph.

- Saving and Restoring the plugin's state.

- Getting parameter information from both main thread and audio thread (`AudioWorklet`).

- Scheduling automation events of audio parameters from both threads.

- Scheduling transport, MIDI and OSC events with the host from both threads.

- Emitting events for downstream WAM plugins from both threads.

- The clean up when the plugin instance is destroyed.

### API Overview

The interfaces defined are: 

- A `WebAudioModule` interface, which is the main entry point of a WAM plugin instance.

- A `WamDescriptor` interface, which the descriptor JSON file should provide as the plugin's general information.

- A `WamNode` interface, which extends WebAudio `AudioNode` that will be connected to the host's audio graph.

- A `WamProcessor` interface, which extends `AudioWorkletProcessor` that process signals in the audio thread.

- A `WamParameter` interface, which provides parameter information on both threads.

- A `WamEvent` interface, which can be used to schedule or emit WAM related events like automations or MIDI messages.

- A `WamEnv` interface, which is available on the audio thread to maintain the graph information there.

### WebAudioModule interface

As a WAM distribution should include at least a descriptor in JSON and a JavaScript file that exports by default a WebAudioModule constructor. The constructor should provide statically:

1. `isWebAudioModuleConstructor` getter that returns `true`.

2. `createInstance` method that asynchronously instantiates the WebAudioModule.

    > This method is a short hand for calling the constructor then the `initialize` method, and should return a Promise that resolves the WebAudioModule constructed and initialized.
    
3. the `new` constructor.

    > The WAM instance constructed by the `new` operator is only usable after calling `initialize` method.

From the host side, once imported the default export from the ESM module, the host can firstly do a type check using the `isWebAudioModuleConstructor` getter, then construct the WAM instance using the `createInstance` method. For example,

```JavaScript
/** @typedef {typeof import('@webaudiomodules/api').WebAudioModule} WebAudioModuleConstructor */
(async () => {
    const audioCtx = new AudioContext();
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

The following properties and methods should also be implemented.

1. `isWebAudioModule` getter that returns `true`.

2. `audioContext` getter that returns the current `BaseAudioContext` the WAM belongs to.

3. `audioNode` getter that returns the `AudioNode` to be attached to an audio graph.

4. `initialized` getter that returns `false` before initialized, and `true` after.

5. `moduleId` getter that returns an identifier of the current WAM, usually composed by its vender + its name.

6. `instanceId` getter that returns the unique identifier of the current WAM instance.

7. `descriptor` getter that returns a `WamDescriptor`, same as the WAM's information in the JSON file.

8. `name` getter that returns the WAM's name.

9. `vendor` getter that returns the WAM vendor's name.

10. `initialize` method to asynchronously initialize the newly constructed WAM and its `AudioNode`, accepting one optional argument to set its initial state, returning a Promise that resolves a `WamNode`. After initialized, the WAM will be available to connect its `AudioNode` to the host's audio graph.

11. `createGui` method to asynchronously create an `Element` that can be attached to the HTML Document as the WAM's GUI, returning a Promise that resolves an `Element`.

    > There could be multiple GUI controlling the same WAM. Make sure all the GUI can control the WAM and are responding to any state change.

12. `destroyGui` method, used to clean up a created GUI, accepting an argument of type `Element` which is an existing but no longer useful GUI, returning `void`.

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

The WAM descriptor contains information that can be used for the host to properly categorize, display, and load WAM by its features. The `WamDescriptor` interface is an object used in the WAM's descriptor JSON file and in its instance's `descriptor` property. It has the following properties.

1. `name`: the WAM's name.
2. `vendor`: the WAM vendor's name.
3. `version`: current version (string).
4. `sdkVersion`: the WAM SDK (API) version used.
5. `thumbnail`: a URL containing an image for the WAM's thumbnail.
6. `keywords`: an array of keyword strings.
7. `isInstrument`: boolean, `true` if the WAM is a MIDI instrument.
8. `website`: a URL of the WAM's development website.

a set of boolean properties indicating the IO support of the WAM. They are optional in the descriptor JSON, but mandatory to the `descriptor` getter under the `WebAudioModule` interface. These properties will affect the WAM's behavior in the host when it receives audio or events from the upstream WAMs.

9. `hasAudioInput`
10. `hasAudioOutput`
11. `hasMidiInput`
12. `hasMidiOutput`
13. `hasAutomationInput`
14. `hasAutomationOutput`
15. `hasMpeInput`
16. `hasMpeOutput`
17. `hasOscInput`
18. `hasOscOutput`
19. `hasSysexInput`
20. `hasSysexOutput`

### WamNode interface
`WamNode` is an extended WebAudio `AudioNode`, available with the `audioNode` getter under the `WebAudioModule` interface. 

A WAM host will use its native (or overridden) [`connect`](https://www.w3.org/TR/webaudio/#dom-audionode-connect) and [`disconnect`](https://www.w3.org/TR/webaudio/#dom-audionode-disconnect) methods to run its underlying DSP in an audio graph. The `WamNode` can also be the destination node of any `AudioNode` connection.

In this `WamNode` interface, the related `WebAudioModule` can be found using the `module` getter.

It has following methods:

Lifecycle related:

1. `destroy`: This method should be called by the host before removing the `WamNode`. The WAM developer could perform a clean up by overriding this method. For example, remove event listeners or close AudioWorklet port.

State related:

2. `getState`
3. `setState`

```JavaScript
(async () => {
    const currentState = await wamNode.getState();
    await wamNode.setState(currentState);
})();
```

A state could be any serializable type used to save or restore a state of a WAM.

Parameters related:

4. `getParameterInfo`
5. `getParameterValues`
6. `setParameterValues`

Note that a WAM parameter is different from WebAudio `AudioParam` to support audio thread side manipulations. To schedule automations to the WAM parameters, the host can use `scheduleEvents`.

Event related:

7. `scheduleEvents`: schedule an WAM event with a timestamp.
8. `clearEvents`: remove all the future events.

An WAM events can contain parameter changes, MIDI events, etc. To all a WAM to send events to other WAMs the host can call following methods.

9. `connectEvents`
10. `disconnectEvents`

The connection should be done on the audio thread by calling `webAudioModules.connectEvents` or `webAudioModules.disconnectEvents`.

These events will be dispatched when sended or processed at the scheduled time. The host can capture them by `addEventListener`.

11. `getCompensationDelay`: The host can get a compensation delay hint value in samples. The value is not measured by the host but provided by the WAM developer.

### WamProcessor interface

Each WAM plugin should provide an `WamProcessor` interface on the `AudioWorklet` thread. The interface is extended by an `AudioWorkletProcessor`, created by an `WamNode`. On the audio thread, the processor can access a `WamEnv` interface under `globalThis.webAudioModules`. When the processor is created, it should call `webAudioModules.create(this);` to register itself to the `WamEnv`.

`WamProcessor` has the following getters and methods:

1. `moduleId` getter: returns an identifier of the current WAM, same as in the `WebAudioModule` interface.

2. `instanceId` getter: returns the unique identifier of the current WAM instance, same as in the `WebAudioModule` interface.

3. `getCompensationDelay`
4. `scheduleEvents`
5. `clearEvents`
6. `destroy`: the method should disconnect from its event graph by calling `webAudioModules.destroy(this);`

They are the same as in the `WamNode` interface.

7. `emitEvents` can be used by the WAM to pass any event to downstream WAMs in the event graph.



