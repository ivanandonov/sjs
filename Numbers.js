/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs
 * @use
 **/

(function() {
	
	var cls = sjs.create('Numbers', {
		
		// PUBLIC STATIC METHODS
		isNumber : function(num) {
			return !(isNaN(num) || !String(num).length);
		},
		
		getNumberBtw : function(num, min, max) {
			return Math.min(Math.max(num, min), max);
		},
		
		isNumberBtw : function(num, min, max) {
			return num >= min && num <= max;
		},
		
		decimalFormat : function(num, n) {
			var str = String(Math.round(num * Math.pow(10, n)) / Math.pow(10, n));
			if (str.indexOf('.') == -1 && n > 0) {
				str += '.0'
			}
			if (n > 0) {
				while(str.split('.')[1].length < n) {
					str += '0';
				}
			}
			return str;
		}
		
	});
	
})();