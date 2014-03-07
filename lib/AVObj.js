/**
 * User: Ian
 * Date: 01/03/14
 * Time: 7:15 PM
 * Project: AVObj vs 0.4 - Making JS Simple.
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 */

//noinspection BadExpressionStatementJS
"use strict";

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
	 * Create function returns a new extension of the AVObject to any new element. If the object has already been extended
	 * it will extend the new object along with the old prototype properties. This also returns a new <code>parent</code> variable
	 * that can be used to navigate up the prototype creation chain.
	 * @return {*} Returns a new prototype to a variable.
	 */
	create: function ()
	{
		var newObj = this.createFinal();
		newObj.init.apply( newObj, arguments );
		return newObj;
	},

	/**
	 * Creates the object but does not fire the actual objects constructor. Use <code>create</code>
	 * Use this class when you are interested in adding properties and methods for any new class or extended class you want to make.
	 * if you want to fire it with its constructor.
	 * @param macros You can set function macro's such as <b>generateSingleton</b> or <b>initOnPageLoad</b>.
	 * @see create
	 * @return {*}
	 */
	extend: function ( macros )
	{
		var newObject = this.createObject();

		if ( macros ) {		// Only bother if the user asked for the macro's
			if ( macros.generateSingleton ) {

				newObject.create = function()
				{
					console.error("Please use singleton constructor 'instance' instead.");
				};

				/**
				 * create a single instance of the object that is defined by its class (Singleton Pattern). Calling this function after the first call will result in a return of an instance instead
				 * of the creation of another object. If you want multiple instances use create() instead.
				 */
				newObject.instance = function()
				{
					if ( newObject._instance == null )
					{
						newObject._instance = this.createFinal();
						this.init.apply( newObject._instance, arguments );
					}
					return newObject._instance;
				}
			}

			if ( macros.initOnPageLoad )
			{
				AVObj._AVLoadList.push( newObject );
			}

			if ( macros.initStaticObject )
			{
				newObject.create = function() { console.error( "Cannot create a static object!" ) };
				newObject.destroy = function() { console.error( "Cannot destroy a static object!" ) }
			}

			if ( macros.preventExtension )
			{
				newObject._lockExtensions = true;
			}
		}

		return newObject
	},

	/**
	 * Destroys the given object (calls deInit).
	 */
	destroy: function ()
	{
		this.deInit();
	},

	createFinal: function ()
	{
		return Object.create( this, {
			parent: {
				get: function ()
				{
					console.error( "Cannot get from keyword 'this.parent'. Please avoid any parent calls that could be scoped to other objects!" );
					return null;
				},
				enumerable: false,
				configurable: false
			},
			super: {
				value: function ()
				{
					console.error( "Cannot call super(); with 'this.super'. please avoid any super calls that could be scoped to other objects!" );
					return null;
				},
				writable: false,
				configurable: false
			},
			_observers: {
				value: {},
				writable: false,
				configurable: false,
				enumerable: false
			}
		} );
	},

	createObject: function ()
	{
		return Object.create( this, {
			parent: {
				get: function ()
				{
					return Object.getPrototypeOf( this );
				},
				enumerable: false,
				configurable: false
			},
			super: {
				value: function ()
				{
					return Object.getPrototypeOf( this ).init.apply( this, arguments );
				},
				writable: false,
				configurable: false
			},
			_observers: {
				value: {},
				writable: false,
				configurable: false,
				enumerable: false
			}
		} );
	},

	/**
	 * Allows you to extend the current list of options of an object to contain more.
	 * @param {Object} objs The objects you want to add.
	 */
	set properties( objs )
	{
		// Can be used to define advanced objects
		if ( typeof objs.advanced == 'object' )
		{
			Object.defineProperties( this, objs );
		}

		for ( var obj in objs )
		{
			// Object Get/Set check.
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
		}
	},

	/**
	 * Fires off an observer-scope
	 * @param {String} eventName The event you want to call
	 * @param {Object} argumentsObj The argument you want to fire
	 */
	fireObservers: function ( eventName, argumentsObj )
	{
		if ( this._observers[eventName] )
			for ( var i = this._observers[eventName].scope.length; i--; )
			{
				this._observers[eventName].scope[i]( argumentsObj );
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

		if ( !this._observers[eventName] )
		{
			this._observers[eventName] = { scope: [], original: []};
		}
		if ( this._observers[eventName] )
		{
			if ( scope[functionName] )
			{
				this._observers[eventName].scope.push( scope[functionName].bind( scope ) );		// Stores a binded reference to a function.
				this._observers[eventName].original.push( scope[functionName] );				// Store the original reference
			}
			else
			{
				console.error( functionName + " Does not exist in the given scope of ", scope )
			}
		}
		else
		{
			console.error( eventName + " : Scope does not exists or has not yet been set." );
		}
	},

	/**
	 * Returns the number of observers listening to an event.
	 * @param eventName	Event to listen to.
	 * @returns {Array.length}
	 */
	getNumObservers : function ( eventName )
	{
		return ( this._observers[eventName] ? this._observers[eventName].scope.length : 0 );
	},

	/**
	 * Remove an observer in a scope.
	 * @param {String} eventName The scope to look in
	 * @param {String} functionName The object to remove
	 * @param {Object} scope of the object you want to remove.
	 */
	removeObserver: function ( eventName, functionName, scope )
	{
		var i = this._observers[eventName].original.indexOf( scope[functionName] );			// Store the original reverence
		if ( i >= 0 )
		{
			this._observers[eventName].scope.splice( i, 1 );
			this._observers[eventName].original.splice( i, 1 );
		}
	},

	/**
	 * A fast way to delete all objects of a certain event.
	 * @param eventName
	 */
	removeObservers : function ( eventName )
	{
		this._observers[eventName] = { scope : [], original: [] };
	}
};

/**
 * Locks the class AVObj so that it cannot be destroyed and prevents it from appearing in any recursion (enumerable).
 */
Object.defineProperties( AVObj,
	{
		_observers: {
			value: {},
			writable: false,
			configurable: false,
			enumerable: false
		},
		_AVLoadList: {		// This list contains a bunch of AVObjects that will be loaded when window "load" fires.
			value : [],
			writable: false,
			configurable: false,
			enumerable: false
		},
		parent: {
			value: AVObj
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
