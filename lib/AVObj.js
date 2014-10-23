/*
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 *
 * Project : AVObj - Making JS Simple.
 * Version : 0.6.1
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * For the latest updates go to http://AVObject.net
 * Visit the wiki for howto information on getting started at https://github.com/Kabe0/AVObj/wiki
 */

/*
 * Compatibility for older browsers without bind support..
 * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
if ( !Function.prototype.bind )
{
	Function.prototype.bind = function ( oThis )
	{
		if ( typeof this !== "function" )
		{
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError( "Function.prototype.bind - what is trying to be bound is not callable" );
		}

		var aArgs = Array.prototype.slice.call( arguments, 1 ),
			fToBind = this,
			fNOP = function ()
			{
			},
			fBound = function ()
			{
				return fToBind.apply( this instanceof fNOP
						? this
						: oThis || window,
					aArgs.concat( Array.prototype.slice.call( arguments ) ) );
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

/**
 * namespace can be called to quickly create a new object and define the properties of that object.
 *
 * @see usingNamespace
 * @param {string} spaces define the namespaces to either create or modify.
 * @param {function} scopeFunction a scope where you can quickly add and change multiple values within the namespace.
 * @returns {object}
 */
function namespace( spaces, scopeFunction )
{
	var curScope = window;		// This will store the last element we search into which will represent the namespace.

	switch (typeof spaces )
	{
	case "object":
		curScope = spaces;
		break;
	case "string":
		spaces = spaces.split( "." );		// Break so that we can increment through the spaces.

		// Go through every element and if the object does not exist, create it.
		for ( var i = 0, length = spaces.length; i < length; i++ )
		{
			if ( spaces[i] in curScope )
			{
				curScope = curScope[spaces[i]];
			}
			else
			{
				curScope[spaces[i]] = {};
				curScope = curScope[spaces[i]];
			}
		}
		break;
	}

	if ( scopeFunction != null )
	{
		scopeFunction.apply( curScope );
	}

	// Return the current scope so new objects can be created in it.
	return curScope;
}

/**
 * UsingNamespace can be called to grab objects and define their attributes inside a scope as
 * if the values were actually defined in the function.
 *
 * @see namespace
 * @param {...(String|Object)} namespaces define the namespaces to add to this new project scope.
 */
function usingNamespace( namespaces )
{
	var scopeNames = [];
	var scopeArguments = [];
	var scope = [];

	var i, argLength = arguments.length - 1;

	for( i = 0; i < argLength; i++ )
	{
		switch( typeof arguments[i] )
		{
		case "object":
			finalObject = arguments[i];
			break;
		case "string":
			var splitNamespace = arguments[i].split(".");
			var finalObject = window[splitNamespace[0]];

			for( var j = 1, length = splitNamespace.length; j < length; j++ )
			{
				finalObject = finalObject[splitNamespace[j]];
			}
			break;
		}


		for( var object in finalObject )
		{
			if ( typeof finalObject[object] === "object" || typeof finalObject[object] === "function" )
			{
				scope.push( finalObject );
				scopeNames.push( object );
				scopeArguments.push( finalObject[object] );
			}
		}
	}
	var functionString = arguments[argLength].toString();
	// Creates a RegExp object which you can then fire the exec prototype method.
	var regResult = (/^function\s*\([\s\w\d,]*\s*\)\s*\{([\S\s]*)}$/g).exec( functionString );

	var functionBody = regResult[1] + " return [" + scopeNames.toString() + "];";
	var scopeChanges = Function( scopeNames, functionBody ).apply( this, scopeArguments );


	for( i = scopeChanges.length; i--; )
	{
		scope[i][scopeNames[i]] = scopeChanges[i];
	}
}

/**
 * AVObject is used for constructing all objects. (namespace utility);
 * @classdesc The AVObject class is the base class that all other classes inherit from.
 * Visit the [getting started]{@link https://github.com/Kabe0/AVObj/wiki/1.-Introduction-,-A-Simple-Script} page for more information on how to construct and inherit from the AVObject class.
 *
 * @class
 */
var AVObj = null; 										// Will be created by the method below.
var AV = { Utilities : {} };							// Defines the main namespace for all AVObject utilities (not necessary, but helps with IDE Editor's.
var AVObjMacro = function( macroName, operation ){};	// Defined below.

// We do a self calling function in order to hide some variables upon construction.
(function ()
{
	var macroList = {};

	////////////////////////////////
	//
	//   Construction objects are all defined here.
	////////////////////////////////
	var observerObject =
	{
		value:        {},
		writable:     true,
		configurable: false,
		enumerable:   false
	};

	var createObject =
	{
		/**
		 * Create function returns a new extension of the AVObject to any new element. If the object has already been extended
		 * it will extend the new object along with the old prototype properties. This also returns a new <code>parent</code> variable
		 * that can be used to navigate up the prototype creation chain.
		 * @return {AVObj} Returns a new prototype to a variable.
		 * @method create
		 * @memberof AVObj
		 */
		value:        function ()
		{
			var newObj = createFinal( this );
			newObj.init.apply( newObj, arguments );
			return newObj;
		},
		writable:     false,
		configurable: false
	};

	function createFinal ( objectPrototype )
	{
		var isDestroyed = false;
		var newObjectValues =
		{
			_extensionCount: {
				value:        objectPrototype._extensionCount,
				writable:     false,
				configurable: false,
				enumerable:   false
			},
			_methodTrack:    {
				value:        0,
				writable:     true,
				configurable: false,
				enumerable:   false
			},
			callParent:      {
				/**
				 * Handles the calling of parent methods. Specify the method name, and number of inherited objects you want to move back to call
				 * a given method.
				 * @param methodName The name of the method you want to call.
				 * @param parents Specify the parent you want to call (0) is the minimum required (if no value, (0) is assumed).
				 * @param methodArguments other arguments related to the method being called.
				 * @returns {*} returns whatever the method called returns.
				 * @method callParent
				 * @memberof AVObj
				 */
				value:        function ( methodName, parents, methodArguments )
				{
					this._methodTrack += ( parents != null ? parents : 0 );

					var returnValue = this["_parent" + ( this._extensionCount - ( this._methodTrack++ ) )][methodName].apply( this, methodArguments );
					this._methodTrack = 0;

					return returnValue;
				},
				writable:     false,
				configurable: false,
				enumerable:   false
			},
			_superTrack:     {
				value:        0,
				writable:     true,
				configurable: false,
				enumerable:   false
			},
			super:           {
				/**
				 * Call in any init method to activate the previous classes init method.
				 * Use {@link AVObj.callParent} if you want to call another overridden member automatically.
				 * @returns {*}
				 * @method super
				 * @instance
				 * @memberof AVObj
				 * @see AVObj.callParent
				 */
				value: function ()
				{
					var returnValue = this["_parent" + ( this._extensionCount - this._superTrack++ )].init.apply( this, arguments );
					this._superTrack = 0;

					return returnValue;
				}
			},
			parent:          {
				get:          function ()
				{
					console.error( "Cannot get from keyword 'this.parent'. Please avoid any parent calls that could be scoped to other objects!" );
					return null;
				},
				enumerable:   false,
				configurable: false
			},
			_observers:      {
				value:        {},
				writable:     true,
				configurable: false,
				enumerable:   false
			},
			create:          {
				value:        function ()
				{
					console.error( "You can't call create on an object that has already been built!" );
					return null;
				},
				writable:     false,
				configurable: false,
				enumerable:   false
			},
			destroyed:       {
				value:        function ()
				{
					return isDestroyed;
				},
				writable:     true,
				configurable: false,
				enumerable:   false
			},
			/**
			 * Destroys the given object.
			 *
			 * Calls deInit of the extended object and AVObj classes
			 * as well handles the removal of links.
			 *
			 * Node this will also seal the object after the deInit is called.
			 * @memberof AVObj
			 * @method
			 * @instance
			 */
			destroy:         {
				value:        function ()
				{
					if ( !isDestroyed )
					{
						this.clearObservers();
						this.deInit();

						// Prevents any future modifications of _isDestroyed and seal the class from
						// having other objects attached to it.
						isDestroyed = true;
						Object.seal( this );
					}
				},
				writable:     false,
				configurable: false
			}
		};

		return Object.create( objectPrototype, newObjectValues );
	}

	/**
	 * Command for extending the {@link AVObj.extend} method with additional macros.
	 * The operationBefore function has two arguments passed in when called:
	 * <ol>
	 *     <li>properties - The new object's properties before it's created.</li>
	 *     <li>options - whatever was passed into the macro when defined.</li>
	 * </ol>
	 *
	 * After the object is constructed the operationAfter is fired.
	 * The operationAfter function has two arguments passed in when called:
	 * <ol>
	 *     <li>object - The object that was just constructed</li>
	 *     <li>options - whatever was passed into the macro when defined.</li>
 *     </ol>
	 *
	 * @param {string} macroName - The name of the new macro you want to create.
	 * @param {function=} operationBefore - The function to call when the macroName is defined.
	 * @param {function=} operationAfter - The function to call when the macroName is defined and the class object has just been constructed.
	 * @function  AVObjMacro
	 */
	AVObjMacro = function( macroName, operationBefore, operationAfter )
	{
		if ( macroList[macroName] == null )
		{
			macroList[macroName] = { before:operationBefore, after:operationAfter };
		}
		else
		{
			console.error(macroName + " Macro is already defined!")
		}
	};

	///////////////////////////////
	//
	//		Load Object on start macro
	///////////////////////////////
	var initOnPageLoad = false;

	AVObjMacro("initOnPageLoad",
		function( properties, options )
		{
			initOnPageLoad = true;
		},
		function( object, options )
		{
			AVObj._AVLoadList.push( object );
		}
	);

	///////////////////////////////
	//
	//		Stops an object from being extended.
	///////////////////////////////
	AVObjMacro( 'preventExtension',
		function( properites )
		{
			properites._lockExtensions =
			{
				value:        true,
				writable:     false,
				configurable: false,
				enumerable:   false
			};
		}
	);

	///////////////////////////////
	//
	//		Creates singleton type class.
	///////////////////////////////
	AVObjMacro( "generateSingleton",
		function( properties, options )
		{
			properties.create =
			{
				value:        function ()
				{
					console.error( "Please use singleton constructor 'instance' instead." );
					return null
				},
				writable:     false,
				configurable: false
			};

			properties._instance =
			{
				value:        null,
				writable:     true,
				configurable: false
			};

			/**
			 * create a single instance of the object that is defined by its class (Singleton Pattern). Calling this function after the first call will result in a return of an instance instead
			 * of the creation of another object. If you want multiple instances use create() instead.
			 */
			properties.instance =
			{
				get: function ()
				{
					if ( this._instance == null )
					{
						this._instance = createFinal( this );
						this.init.apply( this._instance, arguments );
					}
					return this._instance;
				}
			}
		}
	);

	///////////////////////////////
	//
	//		Creates a static object so no one can create or destroy the object.
	///////////////////////////////
	AVObjMacro( "initStaticObject",
		function( properties )
		{
			properties.create =
			{
				value:        function ()
				{
					console.error( "Cannot create a static object!" );
					return null
				},
				writable:     false,
				configurable: false
			};
			properties.destroy =
			{
				value:        function () {console.error( "Cannot destroy a static object!" );},
				writable:     false,
				configurable: false
			};
		}
	);

	////////////////////////////////
	//
	//   Class Creation begins here.
	////////////////////////////////
	AVObj =
	{
		// Init/DeInit can be override.
		init:   function () {},
		deInit: function () {},

		/**
		 * Creates the object but does not fire the actual objects constructor. Use <code>create</code>
		 * Use this class when you are interested in adding properties and methods for any new class or extended class you want to make.
		 * if you want to fire it with its constructor.
		 * @param {object} macros - These macros (bools) can be set to one of the following...
		 * <ul>
		 *     <li>generateSingleton</li>
		 *     <li>initOnPageLoad</li>
		 *     <li>initStaticObject</li>
		 *     <li>preventExtension</li>
		 * </ul>
		 * @param {...Object} interfaces - Defines various interfaces that can be applies to the extend class.
		 * @see AVObj.create
		 * @return {AVObj}
		 * @memberof AVObj
		 */
		extend: function ( macros, interfaces )
		{
			var macroName;	// Used in the macroName loop.
			var newObjectProperties =
			{
				parent:          {
					get:          function ()
					{
						return Object.getPrototypeOf( this );
					},
					enumerable:   false,
					configurable: false
				},
				_observers:      observerObject,
				_extensionCount: {
					value:        this._extensionCount + 1,
					writable:     false,
					configurable: false,
					enumerable:   false
				},
				create:          createObject
			};


			if ( macros )
			{
				for( macroName in macroList )
				{
					if ( macros[macroName] != null && macroList[macroName].before != null )
					{
						macroList[macroName].before( newObjectProperties, macros[macroName] );
					}
				}
			}

			var interfaceValues = {};

			// Goes through and checks all interfaces to make sure they are defined properly.
			for( var i = 2; i < arguments.length; i++ )
			{
				for( var methodName in arguments[i] )
				{
					var method = arguments[i][methodName];

					if ( !interfaceValues[method] )
					{
						var argumentString = "";
						for( var methodArguments in method )
						{
							argumentString += methodArguments + " {" + method[methodArguments] + "} ";
						}
						interfaceValues[methodName] = function()
						{
							console.error("Method - " + methodName + " undefined in interface, with required arguments: " + argumentString);
						};
					}
				}
			}

			newObjectProperties._interfaces =
			{
				value : interfaceValues
			};

			// Build the object and check if it should add it to the initOnPageLoad queue.
			var newObject = Object.create( this, newObjectProperties );

			if ( macros )
			{
				for ( macroName in macroList )
				{
					if ( macros[macroName] != null && macroList[macroName].after != null )
					{
						macroList[macroName].after( newObject, macros[macroName] );
					}
				}
			}

			// Defines an id'd property for parent referencing.
			Object.defineProperty( newObject, "_parent" + newObject._extensionCount,
				{
					value:        this,
					writable:     false,
					configurable: false,
					enumerable:   false
				} );

			return newObject;
		},


		/**
		 * <b>Setter</b> - Allows you to extend the current list of options of an object to contain more.
		 *
		 * If you are passing in an object, the {@link AVObj#properties} method will check for one of the following
		 * property definitions below. <i>Note that all these definitions are reserved for the purposes specified and
		 * will cause an error if used in any other way</i>
		 *
		 * @property {function} Object.get - Allows you to construct a getter. You can also create a set method in the same object.
		 * @property {function} Object.set - Allows you to construct a a setter
		 * @property {*} Object.value - Allows you to set any value with special parameters such as <b>writable</b> and <b>configrable</b>. see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty | MDN Documentation} for more info.
		 *
		 * @example
		 * <caption> Example Usage of Properties</caption>
		 *
		 * var NewClass = AVObj.extend();
		 * NewClass.properties =
		 * {
		 * 	init: function()
		 * 	{
		 * 		console.log("code goes here");
		 * 	},
		 *
		 * 	valueGet :
		 * 	{
		 * 		get : function()
		 * 		{
		 * 			return 11;
		 * 		}
		 * 	},
		 *
		 * 	// Example get/set in a single object.
		 * 	valueGetSet :
		 * 	{
		 *		get : function()
		 *		{
		 * 			return 22;
		 * 		},
		 * 		set : function( value )
		 * 		{
		 *			console.log( "value set" + value );
		 * 		}
		 * 	},
		 *
		 *	// Cannot change this value because writable is true.
		 * 	exampleConstValue :
		 * 	{
		 * 		value : 100;
		 * 		writable : false,
		 * 		configurable : false
		 * 	}
		 * };
		 *
		 * @member {object} <u>setter</u>-properties
		 * @see {@link https://github.com/Kabe0/AVObj/wiki/5.-Getter-Setters | Getter/Setter Example}
		 * @memberof AVObj
		 */
		set properties( objs )
		{
			// Can be used to define advanced objects
			if ( typeof objs.advanced == 'object' )
			{
				Object.defineProperties( this, objs.advanced );
			}

			for ( var obj in objs )
			{
				if ( typeof objs[obj] == 'object' && objs[obj] != null )
				{
					// Object Get/Set check. (this is slow, may need to optimise)...
					if ( typeof objs[obj].get == "function" || typeof objs[obj].set == "function" || objs[obj].value )
					{
						Object.defineProperty( this, obj, objs[obj] );
					}
					else
					{
						this[obj] = objs[obj];
					}
				}
				else
				{
					this[obj] = objs[obj];
				}
			}

			// Throw's errors if any interface value is missing.
			for( var methodName in this._interfaces )
			{
				if ( this[methodName] == null )
				{
					this._interfaces[methodName]();
				}
			}

			if ( this._lockExtensions )	// If macro was defined.
			{
				Object.preventExtensions( this );
			}

		},

		prop : function( objs )
		{
			this.properties = objs;
			return this;
		},

		/***********************************
		 *
		 * OBSERVER COMMANDS START HERE.
		 ***********************************/

		/**
		 * Attaches the AVObj's observer system to any generic object that is not apart of AVObj such as an empty Object or Element.
		 * @param object
		 * @memberof AVObj
		 * @see {@link https://github.com/kabe0/AVObj/wiki/3.%20Observer%20Pattern|Observer Pattern Tutorial}
		 * @see AVObj#addObserver
		 */
		attachObserverModel: function ( object )
		{
			if ( !object._observers && !object.setObserverScope )
			{
				Object.defineProperties( object,
					{
						_observers: {
							value:    {},
							writable: false
						}
					}
				);
				object.setObserverScope = AVObj.setObserverScope;
				object.fireObservers = AVObj.fireObservers;
				object.addObserver = AVObj.addObserver;
				object.removeObserver = AVObj.removeObserver;
				object.getNumObservers = AVObj.getNumObservers;
			}
		},

		/**
		 * Fires off an observer-scope
		 * @param {String} eventName The event you want to call
		 * @param {...Object} Unlimited number of arguments you want to define afterwards to be sent to the observer.
		 * @memberof AVObj
		 * @instance
		 * @see AVObj#addObserver
		 * @see AVObj#removeObserver
		 */
		fireObservers: function ( eventName )
		{
			if ( this._observers[eventName] )
			{
				for ( var i = this._observers[eventName].length; i--; )
				{
					var dataArguments = Array.prototype.slice.call( arguments, 1, arguments.length );
					var observerCall = this._observers[eventName][i];
					observerCall.function.apply( observerCall.scope, dataArguments );
				}
			}
		},
		/**
		 * Set an observer to listen to a scope.
		 * @param {String} eventName The event you want to listen to
		 * @param {String} functionName defined by a property function name.
		 * @param {Object} scope The object you want the observer to fire at (If not defined assumes global scope).
		 * @memberof AVObj
		 * @instance
		 * @see {@link https://github.com/kabe0/AVObj/wiki/3.%20Observer%20Pattern|Observer Pattern Tutorial}
		 * @see AVObj#fireObservers
		 * @see AVObj#removeObserver
 		 * @see AVObj#addAObserver
		 */
		addObserver:   function ( eventName, functionName, scope )
		{
			if ( !scope )	// Assume global if no scope given.
			{
				scope = window;
			}

			if ( !this._observers[eventName] )	// Create observer if it does not exist yet.
			{
				this._observers[eventName] = [];
			}
			if ( scope[functionName] )		// Function exists
			{
				this._observers[eventName].push( {scope: scope, functionName: functionName, function: scope[functionName] } );
			}
			else
			{
				console.error( functionName + " Does not exist in the given scope of ", scope )
			}
		},

		/**
		 * An alternative to the original {@link #addObserver} but instead allows you to define an anonymous method,
		 * which is tracked by the observer utility.
		 * @param {String} eventName eventName The event you want to listen to
		 * @param {String} refName Used to track the anonymous method.
		 * @param {Function} method The method you want to fire.
		 * @param {Object} scope The object you want the observer to fire at (If not defined assumes global scope).
		 * @memberof AVObj
		 * @instance
		 * @see AVObj#addObserver
		 */
		addAObserver : function( eventName, refName, method, scope )
		{
			if ( !scope )	// Assume global if no scope given.
			{
				scope = window;
			}

			if ( !this._observers[eventName] )	// Create observer if it does not exist yet.
			{
				this._observers[eventName] = [];
			}

			this._observers[eventName].push( {scope: scope, functionName: refName, function: method } );
		},

		/**
		 * Returns the number of observers listening to an event.
		 * @param eventName    Event to listen to.
		 * @returns {Array.length}
		 * @memberof AVObj
		 * @instance
		 * @see AVObj#addObserver
		 */
		getNumObservers: function ( eventName )
		{
			return ( this._observers[eventName] ? this._observers[eventName].length : 0 );
		},

		/**
		 * Remove an observer in a scope.
		 * @param {String} eventName The scope to look in
		 * @param {String} functionName The object to remove
		 * @param {Object} scope of the object you want to remove.
		 * @memberof AVObj
		 * @instance
		 * @see AVObj#addObserver
		 * @see AVObj#removeObservers
		 */
		removeObserver: function ( eventName, functionName, scope )
		{
			var currentEvent = this._observers[eventName];
			for ( var i = 0; i < currentEvent.length; i++ )
			{
				if ( currentEvent[i].scope == scope && currentEvent[i].functionName == functionName )
				{
					this._observers[eventName].splice( i, 1 );
					break;
				}
			}
			if ( currentEvent.length == 0 ) delete this._observers[eventName];
		},

		/**
		 * A fast way to delete all objects of a certain event.
		 * @param eventName
		 * @memberof AVObj
		 * @instance
		 * @see AVObj#clearObservers
		 */
		removeObservers: function ( eventName )
		{
			delete this._observers[eventName];
		},

		/**
		 * Erases all the observers attached to the object.
		 * This method is called automatically on destruction.
		 * @see AVObj.destroy
		 * @memberof AVObj
		 * @instance
		 */
		clearObservers: function ()
		{
			this._observers = {};
		}
	};

	/**
	 * Locks the class AVObj so that it cannot be destroyed and prevents it from appearing in any recursion (enumerable).
	 */
	Object.defineProperties( AVObj,
		{
			_observers:      {
				value:        {},
				writable:     true,
				configurable: false,
				enumerable:   false
			},
			_extensionCount: {
				value:        0,
				writable:     false,
				configurable: false,
				enumerable:   false
			},
			_AVLoadList:     {		// This list contains a bunch of AVObjects that will be loaded when window "load" fires.
				value:        [],
				writable:     false,
				configurable: false,
				enumerable:   false
			},
			/**
			 * @member {object} <u>getter</u>-parent
			 * @memberof AVObj
			 */
			parent:          {
				value: AVObj
			},
			create:          createObject
		} );

	// Loops through all the AVObject's defined with initOnPageLoad and creates them.
	window.addEventListener( "load", function ()
	{
		AVObj._AVLoadList.forEach( function ( object )
		{
			if ( object._instance == null )
			{
				object._instance = object.createFinal();
				object._instance.init();
			}
			else
			{
				console.warn( "Object " + object + " has already been created." );
			}
		} );
	} );

})();

