/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs.Delegate, sjs.Utils
 * @use      sjs.Arrays
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Events', {
		
		// PUBLIC STATIC METHODS
		addEvent : function(objName, eventName, method) {
			//$log(this+'.addEvent objName='+objName+' eventName='+eventName);
			if (!getRealObj(objName)) {
				return null;
			}
			var eObj = getEventObj(objName, eventName);
			var id = eObj.ids++;
			eObj.methods.push({ id:id, method:method });
			return id;
		},
		
		removeEvent : function(objName, eventName, id) {
			var eObj = getEventObj(objName, eventName);
			var len = eObj.methods.length;
			for (var i = 0; i < len; i++) {
				if (id == eObj.methods[i].id) {
					eObj.methods.splice(i, 1);
					if (!eObj.methods.length) {
						var rObj = getRealObj(objName);
						var obj = getObj(objName);
						// remove event
						rObj[eventName] = null;
						obj[eventName] = null;
						// remove object if no other events
						var haveEvents = false;
						for (var evt in obj) {
							if (typeof(obj[evt]) != 'function') {
								if (obj[evt] !== null) {
									haveEvents = true;
									break;
								}
							}
						}
						if (!haveEvents) {
							this.removeObj(objName);
						}
					}
					break;
				}
			}
		},
		
		//usefull for onclick or methods that will be called last
		setReturnValue : function(objName, eventName, value) {
			var eObj = getEventObj(objName, eventName);
			eObj.returnValue = value;
		},
		
		removeObj : function(objName) {
			if (objects[objName]) {
				var rObj = getRealObj(objName);
				var obj = getObj(objName);
				sjs.Objects.each(
					obj,
					function(value, prop, obj) {
						try {
							delete rObj[prop];
						} catch (e) {
							rObj[prop] = null;
						}
					}
				);
				objects[objName] = null;
			}
		},
		
		removeAll : function() {
			sjs.Objects.each(
				objects,
				function(value, prop, obj) {
					this.removeObj(prop);
				},
				this
			);
		}
		
	});
		
	// PRIVATE STATIC VARS
	var objects = {};
	
	// PRIVATE STATIC METHODS
	function getRealObj(objName) {
		return $element(objName) || eval(objName);
	};
	
	function getObj(objName) {
		if (!objects[objName]) {
			objects[objName] = {};
		}
		return objects[objName];
	};
	
	function getEventObj(objName, eventName) {
		var obj = getObj(objName);
		if (!obj[eventName]) {
			obj[eventName] = { ids:0, methods:[], returnValue:null };
			getRealObj(objName)[eventName] = $delegate(this, callEvent, objName, eventName);
		}
		return obj[eventName];
	};
	
	function callEvent(objName, eventName) {
		//$log(this+'.callEvent objName='+objName+' eventName='+eventName);
		var eObj = getEventObj(objName, eventName);
		var rObj = getRealObj(objName);
		var args = sjs.Arrays.argsToArray(arguments).slice(2);
		var len = eObj.methods.length;
		for (var i = 0; i < len; i++) {
			eObj.methods[i].method.apply(rObj ,args);
		}
		//$log(eventName+" returnValue type: "+typeof(eObj.returnValue));
		return typeof(eObj.returnValue) == "function" ? eObj.returnValue() : eObj.returnValue;
	};
	
	// call sjs.onLoad
	function onLoad() {
		if (this.parent && this.parent != window && this.parent.onLoad) {
			this.parent.onLoad();
		}
	};
	
	if (cls) {
		cls.addEvent('window', 'onload', $delegate(cls, onLoad)); // if sjs.onLoad exists it will be called

		// memory leak
		cls.addEvent('window', 'onunload', $delegate(cls, cls.removeAll));
	}
})();