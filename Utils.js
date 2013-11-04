
/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs, sjs.ShortcutCall
 * @use      sjs.Arrays, sjs.Objects
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Utils', {
			
		// PUBLIC STATIC METHODS
		callJS : function() {
			var arr = sjs.Arrays.argsToArray(arguments);
			return eval(arr[0]).apply(null, arr.slice(1));
		},
		
		// find elements
		element : function(layer) {
			if (!layer || typeof(layer) != 'string' || !layer.length) {
				return layer;
			}
			return document.getElementById(layer);
		},
		
		// element position
		getElementX : function(el) {
			el = $element(el);
			var x = 0;
			if (el) {
				if (el.offsetParent) {
					x = el.offsetLeft;
					el = el.offsetParent;
					while (el) {
						x += el.offsetLeft;
						el = el.offsetParent;
					}
				} else if (el.x) {
					x = el.x;
				}
			}
			return x;
		},
		
		getElementY : function(el) {
			el = $element(el);
			var y = 0;
			if (el) {
				if(el.offsetParent) {
					y = el.offsetTop;
					el = el.offsetParent;
					while(el) {
						y += el.offsetTop;
						el = el.offsetParent;
					}
				} else if (el.y) {
					y = el.y;
				}
			}
			return y;
		},
		
		getElementWidth : function(obj) {
			obj = $element(obj);
			return obj ? obj.offsetWidth : 0;
		},
		
		getElementHeight : function(obj) {
			obj = $element(obj);
			return obj ? obj.offsetHeight : 0;
		},
		
		// page offset
		getPageXScroll : function() {
			//return (window.pageXOffset ? window.pageXOffset : (document.documentElement && document.documentElement.scrollLeft != null) ? document.documentElement.scrollLeft : document.body.scrollLeft)||0;
			return Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		},
		
		getPageYScroll : function() {
			//return (window.pageYOffset ? window.pageYOffset : (document.documentElement && document.documentElement.scrollTop != null) ? document.documentElement.scrollTop : document.body.scrollTop)||0;
			return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		},
		
		// document and screen dimentions
		getDocumentHeight : function() {
			var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;
			return Math.max(scrollHeight, this.getViewportHeight());
		},
		
		getDocumentWidth : function() {
			var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
			return Math.max(scrollWidth, this.getViewportWidth());
		},
		
		getViewportHeight : function() {
			var mode = document.compatMode;
			if ((mode || this.isIE()) && !this.isOpera()) { // IE, Gecko
				return (mode == 'CSS1Compat') ? document.documentElement.clientHeight : document.body.clientHeight; // ? Standards : Quirks
			}
			return self.innerHeight; // Safari, Opera
		},
		
		getViewportWidth : function() {
			var mode = document.compatMode;
			if (mode || this.isIE()) { // IE, Gecko, Opera
				return (mode == 'CSS1Compat') ? document.documentElement.clientWidth : document.body.clientWidth; // ? Standards : Quirks
			}
			return self.innerWidth; // Safari
		},
		
		// Focus
		focus : function(el) {
			try {
				$element(el).focus();
			} catch(e){};
		},
		
		blur : function(el) {
			try {
				$element(el).blur();
			} catch(e){};
		},
		
		onFocus : function(el, def, select, toPass) {
			el = $element(el);
			if (el && el.value == def) {
				el.value = '';
				if (toPass) {
					el.type = 'password';
				}
				if (select) {
					el.select();
				}
			}
		},
		
		onBlur : function(el, def, toText) {
			el = $element(el);
			if (el && !el.value.split(' ').join('').length) {
				el.value = def;
				if (toText) {
					el.type = 'text';
				}
			}
		},
		
		// class manipulation
		addClass : function(el, cls) {
			el = $element(el);
			if (el) {
				if (this.hasClass(el)) {
					el.className = (el.className.length ? el.className + ' ' : '') + cls;
				}
			}
		},
		
		removeClass : function(el, cls) {
			el = $element(el);
			if (el) {
				// remove class
				el.className = el.className.replace(new RegExp('(.*)\\b' + cls + '\\b(.*)'), '$1$2');
				// remove extra spaces
				el.className = el.className.replace(new RegExp('^\\s+|\\s+$/g'), ''); // trim
				el.className = el.className.replace('  ', ' '); // double space
			}
		},
		
		// visibility of the elements
		
		// HTML ELEMENTS
		
		selects : null,
		
		isSelectsVisible : true,
		
		// show hide all select elements
		showSelects : function() {
			//Debug.log('showSelects');
			if (!this.isSelectsVisible) {
				sjs.Objects.each(this.selects, function(value, prop, obj) {
					$style(value, 'visibility', 'visible');
				});
				this.isSelectsVisible = true;
			}
		},
		
		hideSelects : function() {
			//Debug.log('hideSelects');
			if (this.isSelectsVisible) {
				if (this.selects == null) {
					this.selects = document.getElementsByTagName('select');
				}
				sjs.Objects.each(this.selects, function(value, prop, obj) {
					$style(value, 'visibility', 'hidden');
				});
				this.isSelectsVisible = false;
			}
		},
		
		// LOCATION
		genObjectFromQuery : function(str) {
			if (str) {
				var obj= {};
				var prop;
				var props = str.split('&');
				for (var i = 0; i < props.length; i++) {
					prop = props[i].split('=');
					if (i == 0) {
						if (prop[0].indexOf('?') != -1) {
							prop[0] = prop[0].substr(prop[0].indexOf('?') + 1);
						}
					}
					obj[prop[0]] = prop[1];
				}
				return obj;
			}
			return null;
		},
		
		getQueryParamValue : function(param, str) {
			var q = str || document.location.search || document.location.hash || document.location.href.hash;
			if (q) {
				var startIndex = q.indexOf(param + '=');
				var endIndex = (q.indexOf('&', startIndex) > -1) ? q.indexOf('&', startIndex) : q.length;
				if (q.length > 1 && startIndex > -1) {
					return q.substring(q.indexOf('=', startIndex) + 1, endIndex);
				}
			}
			return '';
		},
		
		getQueryObj : function(str) {
			var q = str || document.location.search || document.location.hash || document.location.href.hash;
			if (!q.indexOf('?')) q = q.substr(1);
			var obj = {};
			if (q) {
				var arr = q.split('&');
				var arr1;
				for (var i = 0,len = arr.length; i < len; i++) {
					arr1 = arr[i].split('=');
					if (arr1[0].indexOf('?') != -1) {
						arr1[0] = arr1[0].substr(arr1[0].indexOf('?') + 1);
					}
					obj[arr1[0]] = arr1[1];
				}
			}
			return obj;
		},
		
		isLocal : function() {
			return document.location.href.indexOf('file:') == 0;
		},
		
		// CUSTOMIZING
		getElementsIn : function(obj, tags, depth, elements) {
			if (!elements) {
				elements = [];
			}
			if (!depth) {
				depth = 0;
			}
			var els = obj.getElementsByTagName(tags[depth]);
			if (tags[depth + 1]) {
				for (var i = 0; i < els.length; i++) {
					elements = arguments.callee(els[i], tags, depth + 1, elements);
				}
			} else {
				for (var i = 0; i < els.length; i++) {
					elements.push(els[i]);
				}
			}
			return elements;
		},
		
		// Methods using jQuery plugins
		
		initScroll: function(holder) {
			if (holder) {
				holder.find('.antiscroll-wrap').antiscroll().data('antiscroll');
			}
		},
		
		clearScroll: function(holder) {
			if (holder) {
				//jQuery.fn.antiscroll.destroy(holder.find('.antiscroll-wrap'));
			}
		},
		
		// tips
		initTips : function(holder) {
			//$log(this + '.initTips holder=' + holder);
			if (holder) {
				holder.find('.tipN').tipsy({ gravity : 'n', fade : true });
				holder.find('.tipS').tipsy({ gravity : 's', fade : true });
				holder.find('.tipW').tipsy({ gravity : 'w', fade : true });
				holder.find('.tipE').tipsy({ gravity : 'e', fade : true });
			}
		},
		
		clearTips : function(holder) {
			//$log(this + '.clearTips holder=' + holder.size());
			if (holder) {
				jQuery.fn.tipsy.destroy(holder.find('.tipN, .tipS, .tipW, .tipE'));
			}
		},
		
		// tabs
		initTabs : function(holder) {
			//$log(this + '.initTabs holder=' + holder.size());
			// init tabs and click on the first
			holder.find('ul.tabs li').click(function() {
				// unset active tab
				holder.find('ul.tabs li').removeClass('activeTab');
				// hide all content
				holder.find('.tab_content').hide();
				// set active tab
				jQuery(this).addClass('activeTab');
				// find and show active content
				holder.find(jQuery(this).find('a').attr('rel')).show();
				return false;
			}).eq(0).trigger('click');
		},
		
		// OTHERS
		// remove the flickering
		fixBgImageCache : function() {
			try {
				document.execCommand('BackgroundImageCache', false, true);
			} catch(e) {}
		}
		
	});

	cls.fixBgImageCache();
	
	function shortcut() {
		$shortcut(['e', 'element'], cls, 'element');
	};
	if (!sjs.classExists('ShortcutCall')) {
		sjs.addClassRegistrationListener('ShortcutCall', shortcut);
	} else {
		shortcut();
	}
	
})();