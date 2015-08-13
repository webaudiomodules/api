/**
 * Web Audio Modules (WAMs) API
 * version 0.1 / 2015-08-12
 * Jari Kleimola and Oliver Larkin
 *
 * http://webaudiomodules.org
 */
var WAM = WAM ||
{
	Synths: {},
	Effects: {},
	Environment: { hasMIDI: navigator.requestMIDIAccess != undefined },
	utils: {},
	AudioContext: window.AudioContext || window.webkitAudioContext,
};

WAM.Controller = function (mode)
{
	// -----------------------------------------------------------------
	// lifecycle
	//	
	this.setup = function (actx, bufsize, desc, proc)
	{
		this.actx = actx;
		this.dataChannel = new WAM.DataChannel(mode);
		if (proc) proc.setup(this.dataChannel);

		var self = this;
		this.dataChannel.connect(this, "pout", "cout", function (e)
		{
			if (e.verb == "post" && e.resource == "/message")
				self.onMessage(e.data);
		});

		return new Promise(function (resolve, reject)
		{
			// NOTE: AWN will fix bufsize to 128
			var msg = { state:1, bufsize:bufsize, actx:actx, desc:desc };
			self.dataChannel.request(self, "set", "/state", msg, 0).then(function (desc)
			{
				self.node = desc.spn;
				self.descriptor = desc;
				resolve(self);
			});
		});
	};
	
	this.terminate = function ()
	{
		var time = this.actx.currentTime;
		this.dataChannel.post(this, "set", "/state", { state:0 }, time);
	}

	this.resize = function (bufsize, sr)
	{
		var self = this;
		return new Promise(function (resolve, reject)
		{
			var msg = { state:2, bufsize:bufsize };
			self.dataChannel.request(self, "set", "/state", msg, 0).then(function (spn)
			{
				self.node = spn;
				resolve(self);
			});
		});
	}
	
	// -----------------------------------------------------------------
	// audio + midi
	//
	this.connect = function (srcdest)
	{
		var self = this;
		if (srcdest.constructor.name == "MIDIInput")
		{
			this.midiInput = srcdest;
			this.midiInput.onmidimessage = function (me)
			{
				self.postMidi(me.data, me.receivedTime);
			};
		}
		else this.node.connect(srcdest);
	}
	this.disconnect = function () { this.node.disconnect(); }
	this.disconnectMidi = function ()
	{
		if (this.midiInput) this.midiInput.onmidimessage = null;
		this.midiInput = null;
	}
	
	// -----------------------------------------------------------------
	// data
	//	
	this.setParam = function (id, value)
	{
		// TODO: string id
		var time = 0; 
		if (window.performance) time = performance.now();
		this.dataChannel.post(this, "set", "/param", { id:id, value:value }, time);
	}
	
	this.setPatch = function (data)
	{
		var time = 0;
		if (window.performance) time = performance.now();
		this.dataChannel.post(this, "set", "/patch", { patch:data }, time);
	}

	// return false from onmidi to filter out message
	// this.onmidi = function (msg, time) {}
	this.postMidi = function (msg, time)
	{
		if (!time && window.performance) time = performance.now();
		else time = 0;
		// if (this.onmidi(msg, time) !== false)
		this.dataChannel.post(this, "post", "/midi", msg, time);
	}
	
	// -- messages to Processor
	this.postMessage = function (verb, res, data)
	{
		var msg = { verb:verb, res:res, data:data };
		var time = performance.now();
		this.dataChannel.post(this, "post", "/message", msg, time);
	}
	
	// -- messages from Processor
	this.onMessage = function (msg) { }
}
