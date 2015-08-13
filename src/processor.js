/**
 * Web Audio Modules (WAMs) API
 * version 0.1 / 2015-08-12
 * Jari Kleimola and Oliver Larkin
 *
 * http://webaudiomodules.org
 */
var WAM = WAM || {};
WAM.Processor = function (dataChannel)
{
	// -- sample accurate midi/parameter/message events
	var equeue = [];	
	var curtime = 0;
	var msSamples;
	var spn;
	
	this.postMessage = function (verb, res, data)
	{
		var msg = { verb:verb, res:res, data:data };
		this.dataChannel.post(this, "post", "/message", msg);
	}

	this.ondata = function (e)
	{
		var data = e.data;
		var res  = e.resource;
		var time = e.time;
		
		switch (e.verb)
		{
			case "set":
			{
				if (res == "/state")
				{
					if (data.state == 1)
					{
						this.actx = data.actx;
						this.sr = data.actx.sampleRate;
						this.bufsize = data.bufsize;
						msSamples = this.sr / 1000;
						
						var desc = this.init(this.bufsize, this.sr, data.desc);
						if (!desc) desc = data.desc;
						if (desc && typeof desc == "string") desc = JSON.parse(desc);
						this.numInputs  = numChannels(desc, "inputs");
						this.numOutputs = numChannels(desc, "outputs");
						this.setupBuffers();	 // for Emscripten
						
						desc.spn = spn = data.actx.createScriptProcessor(data.bufsize, this.numInputs, this.numOutputs);
						desc.spn.onaudioprocess = process.bind(this);						
						this.dataChannel.post(this, "reply", "/state", desc, 0, e.id);
					}
					else if (data.state == 0) this.terminate(time);
					else if (data.state == 2)
					{
						this.bufsize = data.bufsize;
						if (spn)
						{
							spn.disconnect();
							spn.onaudioprocess = null;
							this.resize(this.bufsize);
							spn = this.actx.createScriptProcessor(data.bufsize, this.numInputs, this.numOutputs);
							spn.onaudioprocess = process.bind(this);
							this.dataChannel.post(this, "reply", "/state", spn, 0, e.id);
						}
					}
				}
				else if (res == "/param")
				{
					pushEvent("param", data, time);
					this.onparam(data.id, data.value);
				}
				else if (res == "/patch")
					this.onpatch(data.patch, data.patch.length);
				break;
			}
			case "post":
			{
				if (res == "/message")
				{
					pushEvent("message", data, time);
					this.onmessage(data.verb, data.res, data.data);
				}
				else if (res == "/midi")
				{
					pushEvent("midi", data, time);
					if (data.length <= 3)
						this.onmidi(data[0], data[1] ? data[1] : 0, data[2] ? data[2] : 0);
					else this.onsysex(data, data.length);
				}
				break;
			}
		}
	}
	
	// -----------------------------------------------------------------
	// wrapperAPI
	//
	this.init = function (bufsize, sr, desc) { return null; }
	this.terminate = function () {}
	this.resize = function (bufsize) {}
	this.onparam = function (id, value) {}
	this.onpatch = function (data, length) {}
	this.onmessage = function (verb, res, data) {}
	this.onmidi = function (status, data1, data2) {}
	this.onsysex = function (msg, size) {}
	this.onprocess = function (audio, data) {}
	
	// -----------------------------------------------------------------
	// helpers
	//
	function numChannels(desc, inout)
	{
		var n = 0;
		var ports = desc.audio[inout];
		if (ports) ports.forEach(function (port) { n += port.channels; });
		return n;
	}
	this.setupBuffers = function () {}	
	
	function pushEvent(type, data, time)
	{
		var sampleOffset = ((time - curtime) * msSamples)|0;
		equeue.push({ offset:sampleOffset, type:type, data:data });
	}
	
	function process(ape)
	{
		// if (equeue.length > 0)
			// console.log(equeue.length); // [0].offset);
		
		var audio = { inputs:ape.inputBuffer, outputs:ape.outputBuffer };
		var data = equeue;
		if (this.onprocess(audio, data) === false)
		{
			for (var ch=0; ch<this.numOutputs; ch++)
			{
				var outbuf = audio.outputs.getChannelData(ch);
				for (var n=0, L=outbuf.length; n<L; n++)
					outbuf[n] = 0;
			}
		}		
		equeue = [];
		if (window.performance) curtime = performance.now(); 
	}
};

// -- datachannel
WAM.Processor.prototype.setup = function (dc)
{
	this.dataChannel = dc;
	dc.connect(this, "cout", "pout", this.ondata.bind(this));
}


// ============================================================================
//
WAM.ProcessorASMJS = function (namespace,mod)
{
	var inst = 0;
	var audiobus;
	var audiobufs = [[],[]];
	var ibufsx,obufsx;
	var ns = namespace[mod];

	this.setup = function (dc)
	{
		this.base.setup.call(this, dc);
		inst = wam_ctor();
	}
	
	this.setupBuffers = function ()
	{
		if (!audiobus)
		{
			ibufsx = ns._malloc(this.numInputs);
			obufsx = ns._malloc(this.numOutputs);
			audiobus = ns._malloc(2*4);
			ns.setValue(audiobus,   ibufsx, 'i32');
			ns.setValue(audiobus+4, obufsx, 'i32');
		}
		else	// re-init
		{
			for (var i=0; i<this.numInputs; i++)  ns._free(audiobufs[0][i]*4);
			for (var i=0; i<this.numOutputs; i++) ns._free(audiobufs[1][i]*4);
		}
			
		for (var i=0; i<this.numInputs; i++)
		{
			var buf = ns._malloc( this.bufsize*4 );
			ns.setValue(ibufsx + i*4, buf, 'i32');
			audiobufs[0].push(buf/4);
		}
		for (var i=0; i<this.numOutputs; i++)
		{
			var buf = ns._malloc( this.bufsize*4 );
			ns.setValue(obufsx + i*4, buf, 'i32');
			audiobufs[1].push(buf/4);
		}
	}

	
	// -----------------------------------------------------------------
	// wrapperAPI
	//
	this.init = function (bufsize, sr, desc)
	{
		var d = wam_init(inst, bufsize, sr, "");	// todo: desc
		if (d) d = ns.Pointer_stringify(d);
		return d;
	}	
	this.terminate = function () { wam_terminate(inst); inst = 0; }
	this.resize = function (bufsize) { wam_resize(inst, bufsize); }
	
	this.onparam = function (id, value) { wam_onparam(inst, id, value); }
	this.onpatch = function (patch, length)
	{
		var buf = ns._malloc(length);
		for (var i=0; i<length; i++)
			ns.setValue(buf+i, patch[i], 'i8');
		wam_onpatch(inst, buf, length);
		ns._free(buf);
	}
	
	this.onmidi = function (status, data1, data2) { wam_onmidi(inst, status, data1, data2); }
	this.onsysex = function (msg, length)
	{
		var buf = ns._malloc(length);
		for (var i=0; i<length; i++)		// todo: can this be optimized ?
			ns.setValue(buf+i, msg[i], 'i8');
		wam_onsysex(inst, buf, length);
		ns._free(buf);
	}

	// currently only numbers and strings are supported for 'data'
	this.onmessage = function (verb, res, data)
	{
		if (!isNaN(data)) wam_onmessageN(inst, verb, res, data);
		else if (typeof data == "string") wam_onmessageS(inst, verb, res, data);
	}

	this.onprocess = function (audio, data)
	{
		for (var i=0; i<this.numInputs; i++)
		{
			var waain = audio.inputs.getChannelData(i);
			var wamin = audiobufs[0][i];
			ns.HEAPF32.set(waain, wamin);
		}
		
		wam_onprocess(inst, audiobus, data);	// todo: data
		
		for (var i=0; i<this.numOutputs; i++)
		{
			var waaout = audio.outputs.getChannelData(i);
			var wamout = audiobufs[1][i];
			waaout.set(ns.HEAPF32.subarray(wamout, wamout + this.bufsize));
		}
	}
	
	// -- Emscripten function wrappers
	var wam_ctor = ns.cwrap("createModule", 'number', []);
	var wam_init = ns.cwrap("wam_init", null, ['number','number','number','string']);
	var wam_terminate = ns.cwrap("wam_terminate", null, ['number']);
	var wam_onparam = ns.cwrap("wam_onparam", null, ['number','number','number']);
	var wam_onmidi = ns.cwrap("wam_onmidi", null, ['number','number','number','number']);
	var wam_onsysex = ns.cwrap("wam_onsysex", null, ['number','number','number']);
	var wam_onprocess = ns.cwrap("wam_onprocess", 'number', ['number','number','number']);
	var wam_onpatch = ns.cwrap("wam_onpatch", null, ['number','number','number']);
	var wam_onmessageN = ns.cwrap("wam_onmessageN", null, ['number','string','string','number']);
	var wam_onmessageS = ns.cwrap("wam_onmessageS", null, ['number','string','string','string']);

	// -- this is not yet in CZ101
	try {
	var wam_resize = ns.cwrap("wam_resize", null, ['number','number']);
	} catch (ex) { console.dir(ex); }
};
WAM.ProcessorASMJS.prototype = new WAM.Processor();
WAM.ProcessorASMJS.prototype.constructor = WAM.ProcessorASMJS;
WAM.ProcessorASMJS.prototype.base = WAM.Processor.prototype;