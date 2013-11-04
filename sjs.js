/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  
 * @use      $log
 * @optional     
 **/

(function() {
	
	var Class = {
		
		// we will store sjs classes constructors here
		constructors : {},
		
		/*
		* Each new class(and its instances) has following:
		* 
		* Properties
		*   parent       : points to the object where the class is originaly created
		* 
		* Methods
		*   extend       : a way to add more functionality
		*   toString     : give the class path and its name
		*   instances    : return the count of the instances of the class 
		*   classInstance: return the class (only for instances)
		* 
		* If the new class has public method initialize it will be used
		* for initialization of each instance of the class.
		* After the class is created this method will be removed from it
		* and will be used as constructor for its instances.
		*/
		create : function(classPath, props, rewrite) {
			//Class.log(this + '.create classPath=' + classPath);
			if (!classPath) {
				Class.log('classPath is missing');
			} else if (Class.getClass(classPath) && !rewrite) {
				Class.log(classPath + ' already exists');
			} else {
				if (this != Class && classPath.indexOf(this.toString()) != 0) {
					classPath = this + '.' + classPath;
				}
				var classPath_arr = classPath.split('.');
				var className = classPath_arr.pop();
				var s_count = 0;
				var parent;
				if (classPath_arr.length) {
					parent = Class.getClass(classPath_arr);
					// create the parent of the class is not existing
					if (!parent) {
						var path = '', tmp_className, tmp_class;
						while (classPath_arr.length) {
							tmp_className = classPath_arr.shift();
							if (path.length) {
								path += '.';
							}
							path += tmp_className;
							
							tmp_class = Class.getClass(path);
							if (!tmp_class) {
								tmp_class = Class.create(path);
							}
						}
						parent = tmp_class;
					}
				}
				parent = parent || window;
				function toString(name) {
					//console.log('toString called=' + name);
					return (parent != window ? parent + '.' : '') + (name || className);
				};
				
				// create the class
				var cls = parent[className] = function() {
					
					if (!this.parent) {
						// PRIVATE VARS
						var instance_num = s_count++;
						var _instanceName = className + instance_num;
						
						// PUBLIC METHODS
						this.parent = cls.parent;
						this.toString = function() {
							return toString(_instanceName);
						};
						this.instanceName = function(name) {
							if (name && name.length) {
								_instanceName = name;
							}
							return _instanceName;
						};
						this.classInstance = function() {
							return cls;
						};
						this.instances = function() {
							return cls.instances();
						};
						this.extend = cls.extend;
						
						// call constructor of the class
						
						var constructor = Class.getConstructor(cls.toString());
						if (constructor) {
							try {
								//cls.initialize.apply(this, arguments);
								//Class.initialize(cls, this, );
								constructor.apply(this, arguments);
							} catch (e) {
								Class.log('ERROR: ' + className + '.constructor ' + (e.description || e));
							}
						}
						return this;
					}
					
					throw ('ERROR: ' + className + '.constructor Invalid initialization - use new');
				};
				
				// PUBLIC STATIC VARS
				cls.parent = parent;
				
				// PUBLIC STATIC METHODS
				cls.toString = toString;
				cls.extend = function(obj, rewrite) {
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							if (rewrite || this[prop] === undefined) {
								this[prop] = obj[prop];
							} else {
								Class.log('WARNING: "' + prop + '" already exists!');
							}
						}
					}
					return this;
				};
				cls.instances = function() {
					return s_count;
				};
				
				// add pubilc static vars and methods or rewrite the predefined ones
				cls.extend(props, true);
				
				// register class constuctor and remove it so it wont be a public anymore
				if (typeof(cls.initialize) == 'function') {
					Class.register(cls, cls.initialize);
					delete cls.initialize;
				}
				
				// inform registered listeners that the class has been created
				if (cls != window.sjs) {
					try {
						// timeout is required becouse the returned value of sjs.create must be avaible after the class creation is complete
						setTimeout(function() {
							onClassRegistration(cls.toString());
						}, 0);
					} catch (e) {
						Class.log(e);
					};
				}
				
				return cls;
			}
		},
		
		getClass : function(classPath) {
			//if (window.$log) $log('getClass classPath=' + classPath);
			var path_arr;
			if (String(typeof(classPath)).toLowerCase() == 'string') {
				path_arr = classPath.split('.');
			} else if (classPath.length) { // is array
				path_arr = classPath;
			} else {
				return false;
			}
			if (!path_arr.length) {
				return false;
			} else if (path_arr[0] != 'sjs') {
				path_arr.unshift('sjs');
			}
			
			var parent = window;
			for (var i = 0, len = path_arr.length; i < len; i++) {
				parent = parent[path_arr[i]];
				if (!parent) {
					return false;
				}
			}
			return parent;
		},
		
		register : function(className, constructor) {
			//console.log(this+'.register className='+className+' constructor='+typeof(constructor));
			this.constructors[className] = constructor;
		},
		
		unregister : function(className) {
			if (this.constructors[className] !== undefined) {
				//console.log(this+'.unregister className='+className);
				delete this.constructors[className];
			}
		},
		
		getConstructor : function(className) {
			//console.log(this+'.getConstructor className='+className);
			return this.constructors[className];
		},
		
		log : function(e) {
			if (window.$log) {
				$log(e);
			} else if (window.console) {
				console.log(e);
			}
		},
		
		toString : function() {
			return 'Class';
		}
	};
	
	var userAgent = navigator.userAgent.toLowerCase();
	var cls = Class.create('sjs', {
		
		// PUBLIC STATIC VARS
		browser : {
			version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
			safari: /webkit/.test(userAgent),
			opera: /opera/.test(userAgent),
			msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
			msie6: /msie 6/.test(userAgent) && !/opera/.test(userAgent),
			msie7: /msie 7/.test(userAgent) && !/opera/.test(userAgent),
			mozilla: /mozilla/i.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
			firefox: /firefox/i.test(userAgent)
		},
		
		// PUBLIC STATIC METHODS
		create : function() {
			return Class.create.apply(this, arguments);
		},
		
		type : function(o) {
			return this.getClassName(o).toLowerCase();
		},
		
		isFunction : function(o) {
			return this.type(o) == 'function';
		},
		
		getClassName : function(o) {
			return String(({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1]);
			//return ({}).toString.call(o).match(/^\[object (.*)\]$/)[1];
		},
		
		classExists : function(cls) {
			return !!Class.getClass(cls);
		},
		
		addClassRegistrationListener : function(cls, handler) {
			//Class.log(this + '.addClassRegistrationListener cls=' + cls);
			cls = '' + cls;
			if (cls.indexOf(this + '.') != 0) {
				cls = this + '.' + cls;
			}
			var l = listeners[cls];
			if (!l) {
				l = listeners[cls] = [];
			}
			if (l.indexOf(handler) == -1) {
				l.push(handler);
			}
		},
		
		removeClassRegistrationListener : function(cls, handler) {
			cls = '' + cls;
			var i, l = listeners[cls];
			if (l) {
				if (i = l.indexOf(handler) != -1) {
					l.splice(i, 1);
					if (!l.length) delete l;
				}
			}
		}
		
	});
	
	// PRIVATE STATIC VARS
	var listeners = {};
	
	// PRIVATE STATIC METHODS
	var onClassRegistration = function(clsName) {
		//Class.log(cls + '.onClassRegistration cls=' + clsName);
		var l = listeners[clsName];
		if (l) {
			while (l.length) {
				try {
					if (typeof(l[0]) == 'function') {
						l[0]();
					}
				} catch (e) {
					Class.log(e);
				}
				l.splice(0, 1);
			}
		}
	};
	
})();