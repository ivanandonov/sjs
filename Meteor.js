/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 * 
 * @require  sjs, sjs.Objects
 * @use
 **/
(function() {
	
	// cls variable can be used in "private static methods" to access "public static methods" and "public static vars"
	var cls = sjs.create('Meteor', {
		
		// constructor
		initialize : function() {
			
			// PRIVATE VARS
			
			// PUBLIC VARS
			
			// PRIVATE METHODS
			
			// PUBLIC METHODS
		},
		
		// PUBLIC STATIC VARS
		
		// PUBLIC STATIC METHODS
		setHost : function(host) {
			$log(this + '.setHost host=' + host);
			if (host && host != meteorHost) {
				meteorHost = host;
				if (connected) {
					reconnect();
					return true;
				}
			}
			return false;
		},
		
		setHostId : function(hostId) {
			$log(this + '.setHostId hostId=' + hostId);
			if (hostId && hostId != meteorHostId) {
				meteorHostId = hostId;
				if (connected) {
					reconnect();
					return true;
				}
			}
			return false;
		},
		
		setMode : function(mode) {
			$log(this + '.setMode mode=' + mode);
			if (mode && mode != meteorMode) {
				meteorMode = mode;
				if (connected) {
					reconnect();
					return true;
				}
			}
			return false;
		},
		
		connect : function(hostId) {
			$log(this + '.connect hostId=' + hostId);
			var hold = false;
			if (hostId) {
				hold = this.setHostId(hostId); // will call connect without arguments
			}
			if (!hold) {
				if (meteorHost && meteorHostId) {
					if (window.Meteor) {
						if (connected) {
							this.disconnect();
						}
						
						// register the handler just once at the first connect
						if (!inited) {
							Meteor.registerEventCallback('process', handler);
						}
						
						Meteor.hostId = meteorHostId;
						Meteor.host = meteorHost;
						Meteor.mode = 'stream'; // meteorMode || 'stream';
						$log('Meteor mode=' + Meteor.mode);
						try {
							Meteor.connect();
						} catch (e) {
							$log('Meteor error connect=' + e);
						}
						connected = true;
						inited = true;
					} else {
						$log(this + '.connect Meteor not found!');
					}
				} else {
					$log('ERROR! ' + this + '.connect meteorHost=' + meteorHost + ' meteorHostId=' + meteorHostId);
				}
			}
		},
		
		disconnect : function() {
			$log(this + '.disconnect');
			if (window.Meteor) {
				if (connected) {
					Meteor.disconnect();
					connected = false;
				}
			}
		},
		
		joinChannel : function(channel, backtrack) {
			$log(this + '.joinChannel channel=' + channel);// + ' backtrack=' + backtrack);
			try {
				if (channels.indexOf(channel) == -1) {
					if (window.Meteor) {
						channels.push(channel);
						Meteor.joinChannel(channel, backtrack || 0);
						if (!connected) {
							this.connect();
						}
					} else {
						$error(this + '.joinChannel window.Meteor is missing!');
					}
				} else {
					$error(this + '.joinChannel already on that channel!');
				}
			} catch (e) {
				$error(this + '.joinChannel channel=' + channel + ' ' + e);
			}
		},
		
		leaveChannel : function(channel) {
			$log(this + '.leaveChannel channel=' + channel);
			
			var index = channels.indexOf(channel);
			
			if (index != -1) {
				if (window.Meteor) {
					channels.splice(index, 1);
					Meteor.leaveChannel(channel);
					/*if (!channels.length) {
						this.disconnect();
					}*/
				}
			} else {
				$log(this + '.leaveChannel channel not found!');
			}
		},
		
		leaveAllChannels : function() {
			$log(this + '.leaveAllChannels');
			try {
				if (window.Meteor) {
					while (channels.length) {
						this.leaveChannel(channels[0]);
					}
					// this.disconnect();
				}
				channels = new Array();
			} catch (e) {
				$error(this + '.leaveChannels ' + e);
			}
		},
		
		addListener : function(type, handler) {
			$log(this + '.addListener type=' + type);// + ' handler=' + handler);
			if (!listeners[type]) {
				listeners[type] = new Array();
			}
			if (typeof(handler) == 'function') {
				listeners[type].push(handler);
			}
		},
		
		removeListener : function(type, handler) {
			$log(this + '.removeListener type=' + type);// + ' handler=' + handler);
			if (!listeners[type]) {
				var index = listeners[type].indexOf(handler);
				if (index != -1) {
					listeners[type].splice(index, 1);
				}
			}
		},
		
		removeListeners : function(type) {
			$log(this + '.removeListeners type=' + type);
			if (!type) {
				listeners = new Object();
			} else if (listeners[type]) {
				delete listeners[type];
			}
		},
		
		addGlobalListener : function(handler) {
			$log(this + '.addGlobalListener handler=' + handler);
			if (typeof(handler) == 'function') {
				globalListener = handler;
			}
		},
		
		removeGlobalListener : function() {
			$log(this + '.removeGlobalListener');
			globalListener = null;
		}
		
	});
	
	// PRIVATE STATIC VARS
	var listeners = new Object();
	var channels = new Array();
	var globalListener;
	var inited = false;
	var connected = false;
	var meteorHostId;
	var meteorHost;
	var meteorMode = 'stream';
	
	// PRIVATE STATIC METHODS
	function reconnect() {
		//Debug.log(cls + '.reconnect');
		cls.connect();
	};
	
	function handler(data) {
		//$log(cls + '.handler data=' + data);
		try {
			var packet = jQuery.parseJSON(data);
			//$log('packet=' + sjs.Objects.objectToString(packet, 0));
			
			var handlers = listeners[packet.type];
			if (handlers) {
				for (var i = 0, len = handlers.length; i < len; i++) {
					try {
						handlers[i](packet.data);
					} catch (e) {}
				}
			}
			if (globalListener) {
				try {
					globalListener(packet);
				} catch (e) {
					$error(cls + '.globalListener ' + e);
				}
			}
		} catch (e) {
			$error('invalid json ' + e);
		}
	};
	
})();