/**
 * User: Ian
 * Date: 01/03/14
 * Time: 7:15 PM
 * Project: AVObj vs 0.01 - Making JS Simple.
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 */

//noinspection BadExpressionStatementJS
"use strict";

/**
 * Compatibility for older browsers without bind support..
 * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */
if (!Function.prototype.bind)
{
	Function.prototype.bind = function (oThis)
	{
		if (typeof this !== "function")
		{
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError ("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call (arguments, 1),
			fToBind = this,
			fNOP = function ()
			{
			},
			fBound = function ()
			{
				return fToBind.apply (this instanceof fNOP
					                      ? this
					                      : oThis || window,
				                      aArgs.concat (Array.prototype.slice.call (arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP ();

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
    init  : function () {},
    deInit : function() {},

    /**
     * Create function returns a new extension of the AVObject to any new element. If the object has already been extended
     * it will extend the new object along with the old prototype properties. This also returns a new <code>parent</code> variable
     * that can be used to navigate up the prototype creation chain.
     * @return {*} Returns a new prototype to a variable.
     */
    create : function ()
    {
        var newObj = this.createFinal ();
        newObj.init.apply (newObj, arguments);
        return newObj;
    },

    /**
     * Creates the object but does not fire the actual objects constructor. Use <code>create</code>
     * Use this class when you are interested in adding properties and methods for any new class or extended class you want to make.
     * if you want to fire it with its constructor.
     * @see create
     * @return {*}
     */
    extend : function ()
    {
        return this.createObject ();
    },

    /**
     * create a single instance of the object that is defined by its class (Singleton Pattern). Calling this function after the first call will result in a return of an instance instead
     * of the creation of another object. If you want multiple instances use create() instead.
     */
    instance : function()
    {
        if( this._instance == null )
        {
            this._instance = this.createFinal();
            this.init.apply(this._instance, arguments);
        }
        return this._instance;
    },

    /**
     * Destroys the given object (calls deInit).
     */
    destroy : function()
    {
        this.deInit();
    },

	/**
	 * Checks if the variable is a string that is empty.
	 * @param {String} arguments The value you want to determine if its empty or not.
	 * @return {Boolean} sets to true if the string is empty.
	 */
	empty : function ()
	{
		for (var i = arguments.length; i--;)
			if (!arguments[i] || arguments[i].length === 0) return true;
		return false;
	},

	/**
	 * Add a duplicate of the same variable without inner children and appends it to the same object.
	 * @param {Element} n The element to copy.
	 * @return {*} returns the new one.
	 */
	addClean     : function (n, o)
	{
		return n.parentNode.element (n.nodeName, o);
	},

	/**
	 * Creates a new condensed element
	 * @param {String} e - The element name.
	 * @param {Object} o any element param can be added here.
	 * @return {*} Returns the element to any variable defined.
	 */
	element      : function (e, o)
	{
		var n = document.createElement (e);
		for (var i in o)
		{
			//noinspection JSUnfilteredForInLoop
			switch(i)
			{
				case "text":
					n.addText( o[i] );
				break;

				default:
					n.setAttribute(i, o[i]);
					break;
			}
		}
		return n;
	},

	createFinal : function ()
	{
		return Object.create (this, {
			parent     : {
				get : function()
				{
					console.error("Cannot get from keyword 'this.parent'. Please avoid any parent calls that could be scoped to other objects!");
					return null;
				},
				enumerable : false,
				configurable: false
			},
			super      : {
				value : function ()
				{
					console.error("Cannot call super(); with 'this.super'. please avoid any super calls that could be scoped to other objects!");
					return null;
				},
				writable : false,
				configurable: false
			},
			_observers : {
				value    : {},
				writable : false,
				configurable : false,
				enumerable: false
			}
		});
	},

	createObject : function ()
	{
		return Object.create (this, {
			parent     : {
				get : function()
				{
					return Object.getPrototypeOf(this);
				},
				enumerable : false,
				configurable: false
			},
			super      : {
				value : function ()
				{
					return Object.getPrototypeOf(this).init.apply(this, arguments);
				},
				writable : false,
				configurable:false
			},
			_observers : {
				value    : {},
				writable : false,
				configurable : false,
				enumerable: false
			}
		});
	},

	/**
	 * Allows you to extend the current list of options of an object to contain more.
	 * @param {Object} objs The objects you want to add.
	 */
	set properties (objs)
	{
		for (var obj in objs)
		{
			if (typeof objs[obj] == 'object' && objs[obj] != null && (objs[obj].get || objs[obj].set))
			{
				Object.defineProperty (this, obj, objs[obj]);
			}
			else
			{
				this[obj] = objs[obj];
			}
		}
	},
	/**
	 * Used to set advanced properties
	 * @param {Object} objs The properties you want to create.
	 */
	set advProperties (objs)
	{
		Object.defineProperties (this, objs);
	},
	/**
	 * Prevents other objects from extending an object.
	 */
	preventExtensions : function ()
	{
		Object.preventExtensions (this);
	},

	/**
	 * Attaches the AVObj's observer system to any generic object that is not apart of AVObj such as an empty Object or Element.
	 * @param object
	 */
	attachObserverModel:function(object)
	{
		if (!object._observers && !object.setObserverScope)
		{
			Object.defineProperties (object,
				{
					_observers : {
						value    : {},
						writable : false
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
	 * @param {String} listenScope The scope you want to call
	 * @param {Object} argumentsObj The argument you want to fire
	 */
	fireObservers    : function (listenScope, argumentsObj)
	{
		if(this._observers[listenScope])
			for (var i = this._observers[listenScope].scope.length; i--;)
			{
				this._observers[listenScope].scope[i] (argumentsObj);
			}
	},
	/**
	 * Set an observer to listen to a scope.
	 * @param {String} listenScope The scope you want to listen to
	 * @param {String} functionName The function name you want to call
	 * @param {Object} scope The object you want the observer to fire at
	 */
	addObserver      : function (listenScope, functionName, scope)
	{
		if (!this._observers[listenScope])
		{
			this._observers[listenScope] = {scope : [], original : []};
		}
		if (this._observers[listenScope])
		{
			if (scope[functionName])
			{
				this._observers[listenScope].scope.push (scope[functionName].bind (scope));
				this._observers[listenScope].original.push (scope[functionName]);
			}
			else
			{
				console.error (functionName + " Does not exist in the given scope of ", scope)
			}
		}
		else
		{
			console.error (listenScope + " : Scope does not exists or has not yet been set.");
		}
	},
	/**
	 * Remove an observer in a scope.
	 * @param {String} listenScope The scope to look in
	 * @param {Object} functionName The object to remove
	 */
	removeObserver   : function (listenScope, functionName, scope)
	{
		var i = this._observers[listenScope].original.indexOf (scope[functionName]);
		if (i >= 0)
		{
			this._observers[listenScope].scope = this._observers[listenScope].scope.splice (i, 1);
			this._observers[listenScope].original = this._observers[listenScope].original.splice (i, 1);
		}
	}
};

/**
 * Locks the class AVObj so that it cannot be destroyed and prevents it from appearing in any recursion (enumerable).
 */
Object.defineProperties (AVObj,
                         {
							_observers : {
								value    : {},
								writable : false,
								configurable : false,
								enumerable: false
							},
							parent :
							{
							 value:AVObj
							}
                         });
