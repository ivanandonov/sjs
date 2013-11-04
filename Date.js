/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 *
 * @require  sjs 
 * @use      sjs.Objects, sjs.Strings
 * @optional 
 **/

(function() {
	
	var cls = sjs.create('Date', {
		
		getTimeSince : function(initTime, time, skipDays, skipHours, skipMins, skipSecs, skipMilisecs) {
			var result = '0';
			if (initTime) {
				time = time || new Date().getTime();
				skipMilisecs = skipMilisecs === true; // default false
				skipSecs = skipSecs === true; // default false
				skipMins = skipMins === true; // default false
				skipHours = skipHours !== false || skipMins; // default true
				skipDays = skipDays !== false || skipHours; // default true
				
				//initTime = 0;
				//time = 854 + Math.round(Math.random()*60)*1000 + Math.round(Math.random()*60)*1000*60;
				
				var z = sjs.Strings ? sjs.Strings.zeroPad : function (s) { return s };
				var timer = time - initTime;
				var milisecs = timer % 1000;
				var secs = Math.floor(timer/1000);
				var mins = Math.floor(secs/60);
				var hours = Math.floor(mins/60);
				var days = Math.floor(hours/24);
				if (!skipMins) secs %= 60;
				if (!skipHours) mins %= 60;
				if (!skipDays) hours %= 24;
				result = (skipDays ? '' : z(days, 2) + ':') + 
						(skipHours ? '' : z(hours, 2) + ':') + 
						(skipMins ? '' : z(mins, 2) + ':') + 
						(skipSecs ? '' : z(secs, 2) + ':') + 
						(skipMilisecs ? '' : z(milisecs, 3));
			} else {
				throw this + '.getTimeSince wrong initTime=' + initTime;
			}
			
			return result;
		}
		
	});
	
})();