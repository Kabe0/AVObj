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

/**
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
 * AVObject is used for constructing all objects. (namespace utility);
 * @type {Object}
 */
var AVObj =
{
	// Init/DeInit can be override.
	init: function (){},
	deInit: function (){},

	/**
	 * Creates the object but does not fire the actual objects constructor. Use <code>create</code>
	 * Use this class when you are interested in adding properties and methods for any new class or extended class you want to make.
	 * if you want to fire it with its constructor.
	 * @param macros You can set function macro's such as <b>generateSingleton</b>, <b>initOnPageLoad</b>, <b>initStaticObject</b>, or <b>preventExtension</b>.
	 * @see create
	 * @return {*}
	 */
	extend: function ( macros )
	{
		var newObjectProperties =
		{
			parent:
			{
				get: function ()
				{
					return Object.getPrototypeOf( this );
				},
				enumerable: false,
				configurable: false
			},
			_observers:
			{
				value: {},
				writable: true,
				configurable: false,
				enumerable: false
			},
			_extensionCount :
			{
				value: this._extensionCount + 1,
				writable : false,
				configurable : false,
				enumerable : false
			}
		};

		var initOnPageLoad = false;

		if ( macros ) {		// Only bother if the user asked for the macro's
			if ( macros.generateSingleton ) {

				newObjectProperties.create =
				{
					value : function(){console.error("Please use singleton constructor 'instance' instead."); return null },
					writable : false,
					configurable : false
				};

				newObjectProperties._instance =
				{
					value :  null,
					writable : true,
					configurable : false
				};

				/**
				 * create a single instance of the object that is defined by its class (Singleton Pattern). Calling this function after the first call will result in a return of an instance instead
				 * of the creation of another object. If you want multiple instances use create() instead.
				 */
				newObjectProperties.instance =
				{
					get : function()
					{
						if ( this._instance == null )
						{
							this._instance = this.createFinal();
							this.init.apply( this._instance, arguments );
						}
						return newObject._instance;
					}
				}
			}

			if ( macros.initOnPageLoad )
			{
				initOnPageLoad = true;
			}

			if ( macros.initStaticObject )
			{
				newObjectProperties.create =
				{
					value : function(){console.error( "Cannot create a static object!" ); return null },
					writable : false,
					configurable : false
				};
				newObjectProperties.destroy =
				{
					value : function(){console.error( "Cannot destroy a static object!" );},
					writable : false,
					configurable : false
				};
			}

			if ( macros.preventExtension )
			{
				newObjectProperties._lockExtensions =
				{
					value : true,
					writable : false,
					configurable : false,
					enumerable : false
				};
			}
		}

		// Build the object and check if it should add it to the initOnPageLoad queue.
		var newObject = Object.create( this, newObjectProperties );
		if ( initOnPageLoad ) AVObj._AVLoadList.push(newObject);

		// Defines an id'd property for parent referencing.
		Object.defineProperty( newObject, "_parent" + newObject._extensionCount,
			{
				value : this,
				writable : false,
				configurable : false,
				enumerable : false
			} );


		return newObject;
	},

	createFinal: function ()
	{
		var newObjectValues =
		{
			_extensionCount :
			{
				value: this._extensionCount,
				writable : false,
				configurable : false,
				enumerable : false
			},
			_methodTrack :
			{
				value: 0,
				writable : true,
				configurable : false,
				enumerable : false
			},
			callParent :
			{
				/**
				 * Handles the calling of parent methods. Specify the method name, and number of inherited objects you want to move back to call
				 * a given method.
				 * @param methodName The name of the method you want to call.
				 * @param parents Specify the parent you want to call (0) is the minimum required (if no value, (0) is assumed).
				 * @param methodArguments other arguments related to the method being called.
				 * @returns {*} returns whatever the method called returns.
				 */
				value : function( methodName, parents, methodArguments )
				{
					this._methodTrack += ( parents != null ? parents : 0 );

					var returnValue = this["_parent" + ( this._extensionCount - ( this._methodTrack++ ) )][methodName].apply(this, methodArguments);
					this._methodTrack = 0;

					return returnValue;
				},
				writable : false,
				configurable : false,
				enumerable : false
			},
			_superTrack :
			{
				value: 0,
				writable : true,
				configurable : false,
				enumerable : false
			},
			super:
			{
				/**
				 * Call in any init method to activate the previous classes init method.
				 * @returns {*}
				 */
				value: function ()
				{
					var returnValue = this["_parent" + ( this._extensionCount - this._superTrack++ )].init.apply( this, arguments );
					this._superTrack = 0;

					return returnValue;
				}
			},
			 parent:
			 {
				 get: function ()
				 {
				 	console.error( "Cannot get from keyword 'this.parent'. Please avoid any parent calls that could be scoped to other objects!" );
				 	return null;
				 },
				 enumerable: false,
				 configurable: false
			 },
			_observers: {
				value: {},
				writable: true,
				configurable: false,
				enumerable: false
			},
			_isDestroyed:
			{
				value : false,
				writable: true,
				configurable: false,
				enumerable: false
			},
			create :
			{
				value : function()
				{
					console.error("You can't call create on an object that has already been built!");
					return null;
				},
				writable : false,
				configurable : false,
				enumerable : false
			},
			destroyed :
			{
				value : function()
				{
					return this._isDestroyed;
				},
				writable : true,
				configurable : false,
				enumerable : false
			},
			/**
			 * Destroys the given object.
			 *
			 * Calls deInit of the extended object and AVObj classes
			 * as well handles the removal of links.
			 *
			 * Node this will also seal the object after the deInit is called.
			 */
			destroy :
			{
				value : function()
				{
					if ( !this._isDestroyed )
					{
						this.clearObservers();
						this.deInit();

						// Prevents any future modifications of _isDestroyed and seal the class from
						// having other objects attached to it.
						Object.defineProperty(this, "_isDestroyed", {
							writable : false,
							configurable : false,
							enumerable : false,
							value : true
						});
						Object.seal(this);
					}
				},
				writable : false,
				configurable : false
			}
		};

		return Object.create( this, newObjectValues );
	},

	/***********************************
	 *
	 * OBSERVER COMMANDS START HERE.
	 ***********************************/

	/**
	 * Attaches the AVObj's observer system to any generic object that is not apart of AVObj such as an empty Object or Element.
	 * @param object
	 */
	attachObserverModel: function ( object )
	{
		if ( !object._observers && !object.setObserverScope )
		{
			Object.defineProperties( object,
				{
					_observers: {
						value: {},
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
	 * @param {Object} ... Unlimited number of arguments you want to define afterwards to be sent to the observer.
	 */
	fireObservers: function ( eventName )
	{
		if ( this._observers[eventName] )
		{
			for ( var i = this._observers[eventName].length; i--; )
			{
				var dataArguments = Array.prototype.slice.call(arguments, 1, arguments.length );
				var observerCall = this._observers[eventName][i];
				observerCall.function.apply( observerCall.scope, dataArguments );
			}
		}
	},
	/**
	 * Set an observer to listen to a scope.
	 * @param {String} eventName The event you want to listen to
	 * @param {String} functionName The function name you want to call
	 * @param {Object} scope The object you want the observer to fire at (If not defined assumes global scope).
	 */
	addObserver: function ( eventName, functionName, scope )
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
			this._observers[eventName].push( {scope: scope, function: scope[functionName] } );
		}
		else
		{
			console.error( functionName + " Does not exist in the given scope of ", scope )
		}
	},

	/**
	 * Returns the number of observers listening to an event.
	 * @param eventName	Event to listen to.
	 * @returns {Array.length}
	 */
	getNumObservers : function ( eventName )
	{
		return ( this._observers[eventName] ? this._observers[eventName].length : 0 );
	},

	/**
	 * Remove an observer in a scope.
	 * @param {String} eventName The scope to look in
	 * @param {String} functionName The object to remove
	 * @param {Object} scope of the object you want to remove.
	 */
	removeObserver: function ( eventName, functionName, scope )
	{
		var currentEvent = this._observers[eventName];
		for( var i = 0; i < currentEvent.length; i++ ) {
			if ( currentEvent[i].scope == scope && currentEvent[i].function == scope[functionName] )
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
	 */
	removeObservers : function ( eventName )
	{
		delete this._observers[eventName];
	},

	/**
	 * Erases all the observers attached to the object.
	 */
	clearObservers : function()
	{
		this._observers = {};
	}
};

/**
 * Locks the class AVObj so that it cannot be destroyed and prevents it from appearing in any recursion (enumerable).
 */
Object.defineProperties( AVObj,
	{
		_observers: {
			value: {},
			writable: true,
			configurable: false,
			enumerable: false
		},
		_extensionCount :
		{
			value: 0,
			writable : false,
			configurable : false,
			enumerable : false
		},
		_AVLoadList: {		// This list contains a bunch of AVObjects that will be loaded when window "load" fires.
			value : [],
			writable: false,
			configurable: false,
			enumerable: false
		},
		parent: {
			value: AVObj
		},


		/**
		 * Create function returns a new extension of the AVObject to any new element. If the object has already been extended
		 * it will extend the new object along with the old prototype properties. This also returns a new <code>parent</code> variable
		 * that can be used to navigate up the prototype creation chain.
		 * @return {*} Returns a new prototype to a variable.
		 */
		create:
		{
			value : function ()
			{
				var newObj = this.createFinal();
				newObj.init.apply( newObj, arguments );
				return newObj;
			},
			writable : false,
			configurable : false
		},
		/**
		 * Allows you to extend the current list of options of an object to contain more.
		 * @param {Object} objs The objects you want to add.
		 */
		properties :
		{
			set : function( objs )
			{
				// Can be used to define advanced objects
				if ( typeof objs.advanced == 'object' )
				{
					Object.defineProperties( this, objs );
				}

				for ( var obj in objs )
				{
					// Object Get/Set check. (this is slow, may need to optimise)...
					if ( typeof objs[obj] == 'object' && objs[obj] != null && ( ( typeof objs[obj].get == "function" || typeof objs[obj].set == "function"  ) ) )
					{
						Object.defineProperty( this, obj, objs[obj] );
					}
					else
					{
						this[obj] = objs[obj];
					}
				}

				if ( this._lockExtensions )	// If macro was defined.
				{
					Object.preventExtensions( this );
				}
			},
			configrable : false
		}
	} );

// Loops through all the AVObject's defined with initOnPageLoad and creates them.
window.addEventListener("load", function()
{
	AVObj._AVLoadList.forEach( function( object )
	{
		if (object._instance == null )
		{
			object._instance = object.createFinal();
			object._instance.init();
		}
		else
		{
			console.warn( "Object " + object + " has already been created." );
		}
	});
});
