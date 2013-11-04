/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs, sjs.ShortcutCall
 * @use      
 * @optional 
 **/

(function() {
	
	sjs.create('Cookies', {

		getCookie : function(name) {
			if (typeof(name) != 'string') {
				return document.cookie;
			}
			var start = document.cookie.indexOf(name + '=');
			var len = start + name.length + 1;
			//if (start && name != document.cookie.substring(0, name.length)) return null;
			if (start == -1) {
				return null;
			}
			var end = document.cookie.indexOf(';', len);
			if (end == -1) {
				end = document.cookie.length;
			}
			return unescape(document.cookie.substring(len, end));
		},
		
		setCookie : function(name, value, expires, path, domain, secure) {
			var today = new Date();
			today.setTime(today.getTime());
			expires = (expires || 365)*1000*60*60*24;
			var expires_date = new Date(today.getTime() + expires);
			document.cookie = name + '=' + escape(value) + (expires ? ';expires='+expires_date.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
		},
		
		deleteCookie : function(name, path, domain) {
			if (getCookie(name)) {
				document.cookie = name + '=' + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
			}
		}
		
	});

	if ($shortcut) {
		$shortcut('cookie', sjs.Cookies, function() {
			return sjs.Cookies[arguments.length < 2 ? 'getCookie' : 'setCookie'].apply(sjs.Cookies, arguments);
		});
	}
	
})();