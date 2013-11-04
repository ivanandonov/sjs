/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs 
 * @use      sjs.Objects
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Arrays', {
		
		// PUBLIC STATIC METHODS
		copy : function(arr) {
			var a = [];
			for (var i = 0, len = arr.length; i < len; i++) {
				a[i] = arr[i];
			}
			return a;
		},
		
		isArray : function(arr) {
			return sjs.type(arr) == 'array' || (typeof(arr) == "object" && arr.length !== null);
		},
		
		inArray : function(arr, val) {
			var result = sjs.Objects.each(
				arr,
				function(value, prop, obj) {
					if (value == val) {
						return true;
					}
				}
			);
			return result || false;
		},
		
		createPhpArray : function(arrName, arr) {
			sjs.Objects.each(
				arr,
				function(value, num, arr) {
					arr[i] = encodeURI(value).replace('&', '%26');
				}
			);
			return requestData = arrName+'[]='+arr.join('&'+arrName+'[]=');
		},
		
		indexOf : function(arr, value) {
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				if (arr[i] === value) {
					return i;
				}
			}
			return -1;
		},
		
		argsToArray : function(args) {
			var res = [];
			for (var i = 0, len = args.length; i < len; i++) {
				res[i] = args[i];
			}
			return res;
		},
		
		each : function(arr, method, target) {
			if (this.isArray(arr)) {
				method = typeof(method) == 'function' ? method : target ? target[method] : null;
				if (typeof(method) == 'function') {
					arr = this.copy(arr);
					for (var i = 0, len = arr.length; i < len; i++) {
						method.apply(target || arr, [arr[i], i, arr]); // value, index, arr
					}
				} else {
					//throw(this + '.each: method not found');
				}
			} else {
				//throw(this + '.each: array isn`t provided!');
			}
		},
		
		some : function(arr, method, target) {
			if (this.isArray(arr)) {
				method = typeof(method) == 'function' ? method : target ? target[method] : null;
				if (typeof(method) == 'function') {
					for (var i = 0, len = arr.length; i < len; i++) {
						if (!method.apply(target || arr, [arr[i], i, arr])) { // value, index, arr
							continue;
						}
						return true;
					}
				}
			}
			return false;
		}
		
	});
	
	// some proto methods for old browsers
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(obj, start) {
			for (var i = (start || 0), j = this.length; i < j; i++) {
				if (this[i] === obj) { return i; }
			}
			return -1;
		};
	}
	
})();