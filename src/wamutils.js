/**
 * Web Audio Modules (WAMs) API
 * version 0.1 / 2015-08-12
 * Jari Kleimola and Oliver Larkin
 *
 * http://webaudiomodules.org
 */
var WAM = WAM || {};
WAM.utils = WAM.utils || {};
	
WAM.utils.autoconnect = function (wam)
{
	if (!WAM.Environment.context) WAM.Environment.context = new WAM.AudioContext();
	wam.init(WAM.Environment.context, wam.buffersize).then( function (controller)
	{
		controller.connect(WAM.Environment.context.destination);
	});
}

// -- callbacks with an array of MIDIInput ports, or with null
// -- if midi is unsupported or in case of error
WAM.utils.getMidiInputs = function (callback)
{
	if (!WAM.Environment.hasMIDI) callback(null);
	else navigator.requestMIDIAccess().then(function (midi)
	{
		if (typeof midi.inputs === "function") callback(midi.inputs());
		else
		{
			var ports = [];
			if (midi.inputs && midi.inputs.size > 0)
			{
				var it = midi.inputs.values();
				for (var port = it.next(); port && !port.done; port = it.next())
					ports.push(port.value);
			}
			callback(ports);
		}
	},
	function (err) { console.log(err); callback(null); });	
}

// -- restrict 'v' to stay between 'min'..'max'
WAM.utils.clamp = function (v, min, max)
{
	if (v < min) return min;
	if (v > max) return max;
	return v;
}
