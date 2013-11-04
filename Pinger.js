/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs 
 * @use      jQuery, $log
 **/

(function() {
	
	var cls = sjs.create('Pinger', {
		
		// PUBLIC STATIC VARS
		pingTime : 30, // secs
		
		// PUBLIC STATIC METHODS
		init : function(url) {
			$log(this + '.init url=' + url);
			if (!inited) {
				if (url) {
					pingUrl = url;
				}
				if (sjs.Request) {
					ping();
				} else {
					sjs.addClassRegistrationListener('Request', ping);
				}
			} else {
				$log(Debug.WARNING, this + '.init already inited!');
			}
		},
		
		setUrl : function(url) {
			//$log(this + '.setUrl url=' + url);
			if (pingUrl && sjs.Request.isActiveRequest(pingUrl)) {
				sjs.Request.cancelRequest(pingUrl);
			}
			pingUrl = url;
			if (inited) {
				ping();
			}
		}
		
	});
	
	// PRIVATE STATIC VARS
	var pingUrl;
	var inited;
	
	// PRIVATE STATIC METHODS
	function ping() {
		//$log(cls + '.ping');
		inited = true; // first call is after sjs.Request available
		if (pingUrl) {
			sjs.Request.getJSON(pingUrl, timeout, timeout);
		}
	};
	
	function timeout() {
		//$log(cls + '.timeout');
		setTimeout(ping, cls.pingTime * 1000);
	};
	
	// HANDLERS
	
})();