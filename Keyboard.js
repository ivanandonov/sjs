/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs.Delegate, sjs.Events	
 * @use      sjs.ShortcutCall
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Keyboard', {
		
		// PUBLIC STATIC VARS
		PAUsE:19,
		PG_UP:33,
		PG_DOWN:34,
		END:35,
		HOME:36,
		LEFT:37,
		UP:38,
		RIGHT:39,
		DOWN:40,
		PRINTSCREEN:44,
		INSERT:45,
		DELETE:46,
		DEL:46,
		
		ESCAPE:27,	
		TAB:9,
		CAPS:20,
		SHIFT:16,
		CONTROL:17,
		ALT:18,
		SPACE:32,
		UNDERLINE:109,
		EQUALS:61,
		BACKSPACE:8,
		ENTER:13,
		
		K_0:48,
		K_1:49,
		K_2:50,
		K_3:51,
		K_4:52,
		K_5:53,
		K_6:54,
		K_7:55,
		K_8:56,
		K_9:57,
		
		A:65,
		B:66,
		C:67,
		D:68,
		E:69,
		F:70,
		G:71,
		H:72,
		I:73,
		J:74,
		K:75,
		L:76,
		M:77,
		N:78,
		O:79,
		P:80,
		Q:81,
		R:82,
		S:83,
		T:84,
		U:85,
		V:86,
		W:87,
		X:88,
		Y:89,
		Z:90,
		
		TILDA:92,
		WIN:91,
		WIN_CONTEXT:93,
		
		NUM_LOCK:144,
		NUM_0:96,
		NUM_1:97,
		NUM_2:98,
		NUM_3:99,
		NUM_4:100,
		NUM_5:101,
		NUM_6:102,
		NUM_7:103,
		NUM_8:104,
		NUM_9:105,
		NUM_DEVIDE:111,
		NUM_MULTIPLY:106,
		NUM_SUBTRACT:109,
		NUM_ADD:107,
		NUM_PERIOD:110,
		
		F1:112,
		F2:113,
		F3:114,
		F4:115,
		F5:116,
		F6:117,
		F7:118,
		F8:119,
		F9:120,
		F10:121,
		F11:122,
		F12:123,
		
		SCROLL_LOCK:145,
		
		SEMICOLON:59,
		COMMA:188,
		PERIOD:190,
		SLASH:191,
		BACK_QUOTE:192,
		BRACKET:219,
		BACK_SLASH:220,
		CLOSE_BRACKET:221,
		QUOTE:222,
		BACK_SLASH_LEFT:226,
		
		// PUBLIC STATIC METHODS
		getCode : function(name) {
			return this[name];
		},
		
		getCodeName : function(code) {
			return keys[code];
		},
		
		isKeyPressed : function(name) {
			var code = this.getCode(name.toUpperCase());
			if (code) {
				var len = pressedKeys.length;
				for(var i = 0; i < len; i++) {
					if (pressedKeys[i].code == code) {
						return true;
					}
				}
			}
			return false;
		}
		
	});
	
	// PRIVATE STATIC VARS
	var keys = {};
	var pressedKeys = [];
	var eventsInited = false;
	
	// PRIVATE STATIC METHODS
	function onKeyDown(e) {
		e = window.event || e;
		var found = false;
		var len = pressedKeys.length;
		for (var i = 0; i < len; i++) {
			if (pressedKeys[i].code == e.keyCode) {
				pressedKeys[i].count++;
				found = true;
				break;
			}
		}
		if (!found) {
			pressedKeys.push({ code:e.keyCode, count:1 });
		}
	};
	
	function onKeyUp(e) {
		e = window.event || e;
		var len = pressedKeys.length;
		for (var i = 0; i < len; i++) {
			if (pressedKeys[i].code == e.keyCode) {
				if (--pressedKeys[i].count <= 0) {
					pressedKeys.splice(i, 1);
				}
				break;
			}
		}
	};

	// populate sjs.Keyboard.keys object
	for (var prop in cls) {
		if (typeof(cls[prop]) == 'number') {
			keys[cls[prop]] = prop;
		}
	}

	// shortcuts
	function shortcut() {
		$shortcut(['keyboard', 'kbd'], cls, function(value) {
			while (typeof(value) == 'function') {
				value = value();
			}
			switch (typeof(value)) {
				case 'string':
					return cls.getCode(value);
				case 'number':
					return cls.getCodeName(value);
				default:
					return cls;
			}
		});
	};
	if (!sjs.ShortcutCall) {
		sjs.addClassRegistrationListener('ShortcutCall', shortcut);
	} else {
		shortcut();
	}
	
	// events
	function events() {
		if (!eventsInited && sjs.classExists('Events') && sjs.classExists('Delegate')) {
			sjs.Events.addEvent('document', 'onkeydown', $delegate(cls, onKeyDown));
			sjs.Events.addEvent('document', 'onkeyup', $delegate(cls, onKeyUp));
		}
	}
	if (!sjs.classExists('Events') || !sjs.classExists('Delegate')) {
		if (!sjs.classExists('Events')) sjs.addClassRegistrationListener('Events', events);
		if (!sjs.classExists('Delegate')) sjs.addClassRegistrationListener('Delegate', events);
	} else {
		events();
	}
	
})();