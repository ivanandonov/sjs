/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  init 
 *           use  
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Strings', {
		
		// PUBLIC STATIC METHODS
		htmlEntities : function(str) {
			str = String(str);
			var len = chars.length;
			for (var i = 0; i < len; i++) {
				var myRegExp = new RegExp();
				myRegExp.compile(chars[i],'g');
				str = str.replace(myRegExp, '&' + entities[i] + ';');
			}
			return str;
		},
		
		replace : function(text, search, value, flags) {
			text = String(text || '');
			if (search && search.length) {
				value = value || '';
				if (!flags) {
					flags = 'g';
				}
				var exp;
				if (sjs.type(search) == 'array') {
					sjs.Arrays.each(search, function(str, index, arr) {
						//exp = '/' + str + '/' + flags;
						//$log('exp=' + exp + ' value=' + (sjs.type(value) == 'array' ? value[index] : value) + ' value type=' + sjs.type(search) + ' result=' + String('<opt ').replace(new RegExp('<opt ', flags), '<option '));
						text = text.replace(new RegExp(str, flags), sjs.type(value) == 'array' ? value[index] : value);
					});
				} else {
					//exp = '/' + search + '/' + flags;
					text = text.replace(new RegExp(search, flags), sjs.type(value) == 'array' ? (value[0] || '') : value);
				}
			}
			return text;
		},
		
		trim : function(str) {
			if (arguments.length < 2) {
				arguments[1] = '\\s';
			}
			for (var i = 1; i < arguments.length; i++) {
				str = String(str).replace(new RegExp().compile(String('^' + String(arguments[i]) + '+|' + String(arguments[i]) + '+$'),'g'), '');
			}
			return str;
		},
		
		ltrim : function(str) {
			return str.replace(/^\s+/, '');
		},
		
		rtrim : function(str) {
			return str.replace(/\s+$/, '');
		},
		
		upperFirst : function(str) {
			return str.slice(0, 1).toUpperCase() + str.slice(1);
		},
		
		isValidEmail : function(str) {
			return !!str.match(/\w+@\w+\.\w+/);
		},
		
		zeroPad : function(str, num) {
			var result = String(str);
			var len = result.length;
			for (var i = 0; i < num - len; i++) {
				result = '0' + result;
			}
			return result;
		},
		
		getNumberFromString : function(val) {
			val = String(val);
			var c;
			var firstDot = true;
			var str="";
			var len = val.length;
			for (var i = 0; i<len; i++) {
				c = val.slice(i, i + 1);
				if (isNaN(c)) {
					if (c == "." && firstDot) {
						firstDot = false;
						str += c;
					}
				} else {
					str += c;
				}
			}
			if (!str.length || str == ".") {
				str = 0;
			}
			return isNaN(str) ? 0 : Number(str);
		},
		
		decimalFormat : function(num, n) {
			n = Number(n) || 0;
			var str = String(Math.round(Number(num) * Math.pow(10, n)) / Math.pow(10, n));
			if (str.indexOf('.') == -1 && n > 0) {
				str += '.0';
			}
			if (n > 0) {
				while (str.split('.')[1].length < n) {
					str += '0';
				}
			}
			return str;
		},
		
		cssToObj : function(str) {
			var cssObj = {};
			var cssArr = str.split(';');
			var prop_arr;
			for (var i = 0, len = cssArr.length; i < len; i++) {
				if (i == 0) {
					cssArr[i] = this.trim(cssArr[i], '{');
				} else if (i == len-1) {
					cssArr[i] = this.trim(cssArr[i], '}');
				}
				cssArr[i] = this.trim(cssArr[i]);
				
				if (cssArr[i].length) {
					prop_arr = cssArr[i].split(':');
					prop_arr[0] = camelize(prop_arr[0]);
					cssObj[this.trim(prop_arr[0])] = this.trim(prop_arr[1]);
				}
			}
			return cssObj;
		},
		
		//camelize("border-bottom-color"); // "borderBottomColor"
		camelize : function(str) {
			return (str + '').replace(/-\D/g, function(match) {
				return match.charAt(1).toUpperCase();
			});
		},
		
		// hyphenate("borderBottomColor"); // "border-bottom-color"
		hyphenate : function(str) {
			return (str + '').replace(/[A-Z]/g, function(match) {
				return '-' + match.toLowerCase();
			});
		},
		
		escapeQuotes : function(sString) {
			return sString.replace(/(\')/gi, "\\$1").replace(/(\\\\\')/gi, "\\'");
		},
		
		toNumber : function(str) {
			return parseFloat(str.replace(/[^0-9\-\.]/g, ''));;
		},
		
		parse : function(view, props, onlyOne, strict) {
			var mods = '';
			if (!onlyOne) mods += 'i';
			if (!strict) mods += 'g';
			
			sjs.Objects.each(props, function(value, name, props) {
				//view = view.replace('{' + name.toUpperCase() + '}', value);
				var search = ('{' + name + '}').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				view = view.replace(new RegExp(search, mods), value);
			});
			return view;
		},
		
		slug : function (string) {
			var keys = keys || function (o) { var a = []; for (var k in o) a.push(k); return a; };
			var accents = "\u00e0\u00e1\u00e4\u00e2\u00e8"
				+ "\u00e9\u00eb\u00ea\u00ec\u00ed\u00ef"
				+ "\u00ee\u00f2\u00f3\u00f6\u00f4\u00f9"
				+ "\u00fa\u00fc\u00fb\u00f1\u00e7";
		 
			var without = "aaaaeeeeiiiioooouuuunc";
		 
			var map = {'@': ' at ', '\u20ac': ' euro ', 
				'$': ' dollar ', '\u00a5': ' yen ',
				'\u0026': ' and ', '\u00e6': 'ae', '\u0153': 'oe'};
 
			return string
				// Handle uppercase characters
				.toLowerCase()
		 
				// Handle accentuated characters
				.replace(
					new RegExp('[' + accents + ']', 'g'),
					function (c) { return without.charAt(accents.indexOf(c)); })
		 
				// Handle special characters
				.replace(
					new RegExp('[' + keys(map).join('') + ']', 'g'),
					function (c) { return map[c]; })
		 
				// Dash special characters
				.replace(/[^a-z0-9]/g, '-')
		 
				// Compress multiple dash
				.replace(/-+/g, '-')
		 
				// Trim dashes
				.replace(/^-|-$/g, '');
		}
	});
	
	
	// PRIVATE STATIC VARS
	var chars = [
		'&','à','á','â','ã','ä','å','æ','ç','è','é',
		'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô',
		'õ','ö','ø','ù','ú','û','ü','ý','þ','ÿ','À',
		'Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
		'Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö',
		'Ø','Ù','Ú','Û','Ü','Ý','Þ','€','\"','ß','<',
		'>','¢','£','¤','¥','¦','§','¨','©','ª','«',
		'¬','­','®','¯','°','±','²','³','´','µ','¶',
		'·','¸','¹','º','»','¼','½','¾'
	];
	
	var entities = [
		'amp','agrave','aacute','acirc','atilde','auml','aring',
		'aelig','ccedil','egrave','eacute','ecirc','euml','igrave',
		'iacute','icirc','iuml','eth','ntilde','ograve','oacute',
		'ocirc','otilde','ouml','oslash','ugrave','uacute','ucirc',
		'uuml','yacute','thorn','yuml','Agrave','Aacute','Acirc',
		'Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute',
		'Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde',
		'Ograve','Oacute','Ocirc','Otilde','Ouml','Oslash','Ugrave',
		'Uacute','Ucirc','Uuml','Yacute','THORN','euro','quot','szlig',
		'lt','gt','cent','pound','curren','yen','brvbar','sect','uml',
		'copy','ordf','laquo','not','shy','reg','macr','deg','plusmn',
		'sup2','sup3','acute','micro','para','middot','cedil','sup1',
		'ordm','raquo','frac14','frac12','frac34'
	];
	
})();