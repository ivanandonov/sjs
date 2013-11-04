/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 * 
 * @require  sjs
 * @use      sjs.Arrays
 **/
(function() {
	
	// PRIVATE STATIC VARS - need too be here if we use them for initializing public vars
	var privateStaticVar = 'privateStaticVar';
	
	// "cls" variable is used in "private static methods" to access "public static methods" and "public static vars"
	var cls = sjs.create('Example', {
		
		// constructor
		initialize : function() {
			
			$log(this + '.initialize args=' + sjs.Arrays.argsToArray(arguments));
			$log(this + '.initialize cls=' + cls);
			
			// PRIVATE VARS
			// "$this" variable is used in "private methods" to access "public methods" and "public vars"
			var $this = this;
			
			var privateVar = 10;
			
			// PUBLIC VARS
			this.publicVar = 20;
			
			// PRIVATE METHODS
			function privateMethod() {
				$log($this + '.privateMethod');
				privateVar++;
				$this.publicVar++;
				return $this.publicMethod1();
			};
			
			// PUBLIC METHODS
			this.getter = function(v) {
				return this[v] != undefined ? this[v] : eval(v);
			};
			
			this.publicMethod = function() {
				$log(this + '.publicMethod cls=' + cls);
				return privateMethod();
			};
			
			this.publicMethod1 = function() {
				$log(this + '.publicMethod1');
				return 'privateVar=' + privateVar + ' publicVar=' + this.publicVar + ' classInstance=' + this.classInstance();
			};
			
		},
		
		// PUBLIC STATIC VARS
		publicStaticVar : 'publicStaticVar',
		
		// PUBLIC STATIC METHODS
		publicStaticMethod : function() {
			$log(this + '.publicStaticMethod');
			return privateStaticMethod();
		},
		
		publicStaticMethod1 : function() {
			$log(this + '.publicStaticMethod1');
			return privateStaticMethod1();
		}
		
	});
	
	// PRIVATE STATIC METHODS
	function privateStaticMethod() {
		$log(cls + '.privateStaticMethod');
		return cls.publicStaticMethod1();
	};
	
	function privateStaticMethod1() {
		$log(cls + '.privateStaticMethod1');
		return cls.publicStaticVar + ' ' + privateStaticVar + ' ' + cls;
	};
	
})();