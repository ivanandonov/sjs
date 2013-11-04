/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs 
 * @use  
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Objects', {
		
		// PUBLIC STATIC METHODS
		each : function(obj, method, target) {
			if (obj && typeof(obj) == 'object') {
				method = typeof(method) == 'function' ? method : target ? target[method] : null;
				if (typeof(method) == 'function') {
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							method.apply(target || obj, [obj[prop], prop, obj]); // value, name, obj
							/*var result = method.apply(target || obj, [obj[prop], prop, obj]); // value, name, obj
							if (result !== null && result !== undefined) {
								return result;
							}*/
						}
					}
				}
			}
		},
		
		some : function(obj, method, target) {
			if (typeof(obj) == 'object') {
				method = typeof(method) == 'function' ? method : target ? target[method] : null;
				if (typeof(method) == 'function') {
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							if (!method.apply(target || obj, [obj[prop], prop, obj])) { // value, name, obj
								continue;
							}
							return true;
						}
					}
				}
			}
			return false;
		},
		
		copy : function(fromObj, toObj, includeMethods) {
			if (!toObj) {
				toObj = {};
			}
			for (var prop in fromObj) {
				if (includeMethods || typeof(fromObj[prop]) != 'function') {
					toObj[prop] = fromObj[prop];
				}
			}
			return toObj;
		},
		
		objectToString : function(obj, depth, except) {
			if (!obj) {
				return null;
			}
			// max depth level is set to 10
			depth = !depth ? 0 : Math.min(Math.max(depth, 0), 10);
			var result = '';
			if (typeof(obj) == 'object') {
				result += sjs.type(obj) == 'array' ? '[' : '{';
				for (var prop in obj) {
					result += ' ' + prop;
					if (depth > 0) {
						switch (typeof(obj[prop])) {
							case 'object':
								if (!except || except.indexOf(prop) == -1) {
									result += ':' + this.objectToString(obj[prop], depth, except);
									break;
								}
							default:
								result += ':' + obj[prop];
						}
					} else {
						switch (sjs.type(obj[prop])) {
							case 'array':
								result += ':[]';
								break;
							default:
								result += ':' + obj[prop];
						}
					}
					result += ',';
				}
				// remove last ","
				if (result.indexOf(',') != -1) {
					result = result.split(',')
					result.pop();
					result = result.join(',');
				}
				result += sjs.type(obj) == 'array' ? ' ]' : ' }';
			} else {
				result += obj;
			}
			return result;
		},
		
		serialize : function(obj, re) {
			var result = [];
			this.each(obj, function(value, name, obj) {
				if ((re && re.test(name)) || !re) {
					result.push(name + ': ' + (
						typeof(value) == 'object'
							? value.join 
								? '\'' + value.join(', ') + '\''
								: cls.serialize(value)
							: '\'' + value + '\''
						)
					);
				}
			});
			return '{' + result.join(', ') + '}';
		},
		
		compare : function(obj1, obj2) {
			return !cls.some(obj1, function(prop, value, obj) {
				return value != obj2[prop];
			});
		},
		
		// obj2 rewrite obj1
		combine : function() { // obj1, obj2, obj3, ...
			var result = {};
			for (var i = 0, len = arguments.length; i < len; i++) {
				cls.each(arguments[i], function(value, prop, obj) {
					// if it is a basic Object go deeper
					if (sjs.type(value) == 'object') {
						result[prop] = cls.combine(result[prop] || {}, value);
					} else {
						result[prop] = value;
					}
				});
			}
			return result;
		},
		
		isEmpty : function(obj) { 
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					return false;
				}
			}
			return true;
		}
		
	});
	
})();