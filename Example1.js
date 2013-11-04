/**
 * @author   Ivan Andonov
 * @email:   ivan.andonov[at]gmail[dot]com
 * 
 * @require  sjs
 * @use      sjs.Arrays
 **/
(function() {
	
	// "cls" variable is used in "private static methods" to access "public static methods" and "public static vars"
	var cls = sjs.create('Example', {
		
		// constructor
		initialize : function() {
			
			$log(this + '.initialize args=' + sjs.Arrays.argsToArray(arguments));
			
			// PRIVATE VARS
			// "instance" variable is used in "private methods" to access "public methods" and "public vars"
			var instance = this;
			
			var privateVar = 10;
			
			// PUBLIC VARS
			this.publicVar = 20;
			
			// PRIVATE METHODS
			function privateMethod() {
				$log(instance + '.privateMethod');
				// call public method
				instance.publicMethod1();
				// call private method
				privateMethod1();
				// call public static method
				instance.classInstance().publicStaticMethod();
				// or
				cls.publicStaticMethod();
			};
			
			function privateMethod1() {
				$log(instance + '.privateMethod1');
			};
			
			// PUBLIC METHODS
			this.publicMethod = function() {
				$log(this + '.publicMethod');
				// call public method
				this.publicMethod1();
				// call private method
				privateMethod1();
				// call public static method
				this.classInstance().publicStaticMethod();
				// or
				cls.publicStaticMethod();
			};
			
			this.publicMethod1 = function() {
				$log(this + '.publicMethod1');
			};
			
		},
		
		// PUBLIC STATIC VARS
		publicStaticVar : 'publicStaticVar',
		
		// PUBLIC STATIC METHODS
		publicStaticMethod : function() {
			$log(this + '.publicStaticMethod');
			// call public static method
			this.publicStaticMethod1();
			// call private static method
			privateStaticMethod1();
		},
		
		publicStaticMethod1 : function() {
			$log(this + '.publicStaticMethod1');
		}
		
	});
	
	// PRIVATE STATIC VARS
	var privateStaticVar = 'privateStaticVar';
	
	// PRIVATE STATIC METHODS
	function privateStaticMethod() {
		$log(cls + '.privateStaticMethod');
		// call public static method
		cls.publicStaticMethod1();
		// call private static method
		privateStaticMethod1();
	};
	
	function privateStaticMethod1() {
		$log(cls + '.privateStaticMethod1');
	};
	
})();