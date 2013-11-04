/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs 
 * @use      jQuery, $log
 **/

(function() {
	
	var cls = sjs.create('Request', {
		
		// PUBLIC STATIC VARS
		GET : 'GET',
		POST : 'POST',
		
		// PUBLIC STATIC METHODS
		getJSON : function(url, success, error, data, type) {
			return this.createRequest(url, success, error, true, data, type);
		},
		
		createRequest : function(url, success, error, json, data, type) {
			//$log(Debug.REQUEST, this + '.createRequest url=' + url + ' json=' + json + ' data=' +sjs.Objects.objectToString(data) + ' type=' + (type == 'POST' ? 'POST' : 'GET'));
			try {
				if (url) {
					switch (type) {
						case 'POST':
							break;
						default:
							type = 'GET';
					}
					
					this.cancelRequest(url);
					var startTime = new Date().getTime();
					var ajax = json ? jQuery.getJSON : jQuery.ajax;
					
					var rObj = requests[url] = {
						url : url,
						successHandler : success,
						errorHandler : error,
						active : true,
						error : false,
						id : counter++,
						data : data
					};
					
					var request = jQuery.ajax({
						url : url, 
						dataType : json ? 'json' : null,
						data : data || null,
						type : type,
						success : function(result) {
							rObj.error = false;
							if (typeof(rObj.successHandler) == 'function') {
								rObj.successHandler(result, {
									url : url,
									id : rObj.id,
									data : rObj.data,
									startTime : startTime,
									endTime : new Date().getTime(),
									time : sjs.Date.getTimeSince(startTime, new Date().getTime())
								});
							}
						},
						error : function() {
							rObj.error = true;
							if (typeof(rObj.errorHandler) == 'function') {
								rObj.errorHandler();
							}
						},
						dataFilter : function(data) {
							rObj.active = false;
							//$log('dataFilter json=' + json + ' data=' + data + ' ' + jQuery.parseJSON(data));
							return data;
						}
					});
					
					rObj.request = request;
					
					return rObj;
				}
			} catch (e) {
				$error(this + '.createRequest url=' + url + ' ' + e);
			}
		},
		
		cancelRequest : function(req) {
			//$log(Debug.METHOD, this + '.cancelRequest req=' + req);
			var url;
			switch (sjs.type(req)) {
				case 'string':
					url = req;
					break;
				case 'object':
					url = req.url;
					break;
			}
			
			if (url && this.isActiveRequest(url)) {
				requests[url].active = false;
				// remove handlers
				delete requests[url].errorHandler;
				delete requests[url].successHandler;
				// abort the request
				requests[url].request.abort();
				// delete it
				requests[url].request = null;
				delete requests[url];
			}
		},
		
		isActiveRequest : function(url) {
			//return requests[url] && requests[url].readyState != 4;
			return requests[url] && requests[url].active;
		},
		
		getRequestSendData : function(url) {
			var data;
			if (requests[url]) {
				data = requests[url].data;
			}
			return data;
		}
		
	});
	
	// PRIVATE STATIC VARS
	var requests = {};
	var counter = 0;
	
})();