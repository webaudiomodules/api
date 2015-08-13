/**
 * Web Audio Modules (WAMs) API
 * version 0.1 / 2015-08-12
 * Jari Kleimola and Oliver Larkin
 *
 * http://webaudiomodules.org
 */
var WAM = WAM || {};

// ----------------------------------------------------------------------------
// WAM.DataChannel
// 
// bidirectional communication channel between WAM.Controller <-> WAM.Processor
// - implements and hides async/sync mechanisms
// - for testing, final deployed version will be much simpler
// 
WAM.DataChannel = function (mode)
{
	mode = mode || "async";
	var isasync = mode == "async";
	var endpoints = [];
	var requests = [];
	var eventID = 1;

	// -- pubsub
	this.connect = function (endpoint, oport, iport, ondata)
	{
		iport = "wamevent-" + iport;
		oport = "wamevent-" + oport;
		endpoints.push({ ep:endpoint, oport:oport, iport:iport, callback:ondata });
		if (isasync)
			window.addEventListener(iport, this.onevent.bind(this));
	}

	// -- publish
	this.post = function (sender, verb, resource, data, time, idEvent)
	{
		var p = pack(sender, verb, resource, data, time, idEvent);
		if (isasync)
		{
			for (var i=0; i<endpoints.length; i++)
			{
				if (endpoints[i].ep == sender)
				{
					var ep = endpoints[i];
					var e = new CustomEvent(ep.oport, { detail: p });
					window.dispatchEvent(e);
					break;
				}
			}
		}
		else
		{
			if (verb == "reply")
				resolveRequest(idEvent, data);
			else for (var i=0; i<endpoints.length; i++)
			{
				var ep = endpoints[i];
				if (ep.ep != sender && ep.callback)
						ep.callback(p);
			}
		}
	}

	// -- subscribed + reply
	// -- need to have it here instead of binding directly to endpoints
	this.onevent = function (e)
	{
		if (e.detail.verb == "reply")
			resolveRequest(e.detail.id, e.detail.data);
		else
		{
			for (var i=0; i<endpoints.length; i++)
			{
				var ep = endpoints[i];
				if (ep.iport == e.type && ep.callback)
					ep.callback(e.detail);
			}
		}
	}

   // -- request/reply
	this.request = function (sender, verb, resource, data, time, idEvent)
	{
		var self = this;
		return new Promise(function (resolve, reject)
		{
			if (idEvent == undefined) idEvent = eventID;
			requests.push({ id:idEvent, resolve:resolve, reject:reject });
			self.post(sender, verb, resource, data, time, idEvent);
		});
	}

	function resolveRequest(id, data)
	{
		for (var i=0; i<requests.length; i++)
		{
			if (requests[i].id == id)
			{
				requests[i].resolve(data);
				requests.splice(i,1);
				break;
			}
		}
	}
	
	function pack(sender, verb, resource, data, time, id)
	{
		if (id == undefined) id = eventID++;
		if (time == undefined) time = 0;
		return { verb:verb, resource:resource, data:data, time:time, id:id, sender:sender };
	}	
}

