/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 * 
 * @require  sjs, sjs.ShortcutCall
 * @use      sjs.Utils, sjs.Debug
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Delegate', {

		/**
		 * @param target  object or null for window
		 * @param method  string or function
		 * @param ...rest arguments that will be passed to the method on every call
		 * 
		 * @return        function
		 * 
		 * @usage:
		 *			var obj = {
		 *				name : 'testObject',
		 *				method : function() {
		 *					alert(this.name + '.method');
		 *					for (var i = 0; i < arguments.length; i++) {
		 *						alert('arg' + i + '=' + arguments[i]);
		 *					}
		 *				}
		 *			}
		 *			var delegate = $delegate(obj, 'method', 1, 2);
		 *			//var delegate = Delegate.create(obj, 'method', 1, 2);
		 *			delegate(3, 4);
		 **/
		create : function(target, method) {
			var t = target;
			var m = method;
			var args = [];
			for (var i = 2; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			return function() {
				var arr = [].concat(args);
				for (var i = 0; i < arguments.length; i++) {
					arr.push(arguments[i]);
				}
				try {
					var el = window.$element ? $element(t) : t;
					switch (typeof(m)) {
						case 'string':
							return (el[m] || eval(m)).apply(el, arr);
						case 'function':
							return m.apply(el, arr);
						default:
							if (sjs.Debug) {
								$logError('WARNING! Delegate.create unexpected method type: ' + typeof(m));
							}
					}
				} catch (error) {
					if (sjs.Debug) {
						$logError('ERROR! ' + t + '.' + m + ' => ' + (error.description || error));
					}
				}
				return null;
			};
		}
		
	});
	
	function shortcut() {
		$shortcut(['d', 'delegate'], cls, 'create');
	};
	if (!sjs.classExists('ShortcutCall')) {
		sjs.addClassRegistrationListener('ShortcutCall', shortcut);
	} else {
		shortcut();
	}
	
})();