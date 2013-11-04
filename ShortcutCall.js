/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs
 * @use      sjs.Debug
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('ShortcutCall', {
		
		// PUBLIC STATIC METHODS
		add : function(shortcut, target, method) {
			var t = target;
			var m = method;
			var shortcuts = typeof(shortcut) == 'string' ? [shortcut] : shortcut;
			var len = shortcuts.length;
			for (var i = 0; i < len; i++) {
				window['$' + shortcuts[i]] = function() {
					try {
						return (typeof(m) == 'string' ? t[m] : m).apply(t, arguments);
					} catch (error) {
						try {
							$logError('WARNING! shortcut "' + shortcuts + '" error on method ' + t + '.' + m +  '; description: ' + (error.description || error));
						} catch(e) {};
					}
				};
			}
		},
		
		remove : function(shortcut) {
			var s = _get(shortcut);
			if (s) {
				delete s;
			} else {
				delete _shotcuts[shortcut];
			}
		},
		
		disable : function(shortcut) {
			var s = _get(shortcut);
			if (s) {
				_shotcuts[shortcut] = s;
				delete s;
			}
		},
		
		enable : function(shortcut) {
			var s = _get(shortcut);
			if (!s) {
				_shotcuts[shortcut] = s;
				delete s;
			}
		}
		
	});
	
	// PRIVATE STATIC VARS
	var _shotcuts = {};
	
	// PRIVATE STATIC METHODS
	function _get(shortcut, local) {
		return local ? _shotcuts['$' + shortcut] : window['$' + shortcut];
	};
	
	function _delete(shortcut) {
		delete window['$' + shortcut];
	};

	cls.add('shortcut', cls, 'add');
	
})();