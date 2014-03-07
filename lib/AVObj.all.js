/**
 * User: Ian
 * Date: 03/05/14
 * Time: 7:15 PM
 * Project: AVObj vs 0.4 - Making JS Simple.
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * This js file contains additional functionality for the Element class that are useful when used in conjuntion with
 * AVObj.
 */
"use strict";

if ( !Function.prototype.bind )
{
	Function.prototype.bind = function ( oThis )
	{
		if ( typeof this !== "function" )
		{
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

var AVObj =
{
	init: function (){},
	deInit: function (){},

	create: function ()
	{
		var newObj = this.createFinal();
		newObj.init.apply( newObj, arguments );
		return newObj;
	},

	extend: function ( macros )
	{
		var newObject = this.createObject();

		if ( macros ) {		// Only bother if the user asked for the macro's
			if ( macros.generateSingleton ) {

				newObject.create = function()
				{
					console.error("Please use singleton constructor 'instance' instead.");
				};

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

	set properties( objs )
	{
		if ( typeof objs.advanced == 'object' )
		{
			Object.defineProperties( this, objs );
		}

		for ( var obj in objs )
		{
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

	fireObservers: function ( eventName, argumentsObj )
	{
		if ( this._observers[eventName] )
			for ( var i = this._observers[eventName].scope.length; i--; )
			{
				this._observers[eventName].scope[i]( argumentsObj );
			}
	},
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

	getNumObservers : function ( eventName )
	{
		return ( this._observers[eventName] ? this._observers[eventName].scope.length : 0 );
	},

	removeObserver: function ( eventName, functionName, scope )
	{
		var i = this._observers[eventName].original.indexOf( scope[functionName] );			// Store the original reverence
		if ( i >= 0 )
		{
			this._observers[eventName].scope.splice( i, 1 );
			this._observers[eventName].original.splice( i, 1 );
		}
	},

	removeObservers : function ( eventName )
	{
		this._observers[eventName] = { scope : [], original: [] };
	}
};

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

var Animator = AVObj.extend();
Animator.properties =
{
	play : function( animationName, speed, numberOfTimes )
	{

	},

	pause : function()
	{

	}
};
"use strict";

var CheckMedia = AVObj.extend( { generateSingleton : true } );
CheckMedia.properties =
{
	head : null,															// Location where query nodes are created.

	queryList : [],															// List of all the query objects that the class has.

	events : {																// List of available events you can listen to (used on the query objects).
		ON_TRUE:"onTrue",
		ON_FALSE:"onFalse"
	},

	init : function()
	{
		window.addEventListener( "resize", this.checkQueryStates.bind( this ) );
	},

	registerQuery : function( query )
	{
		var idValue = "_CheckMediaN" + this.queryList.length;

		var styleQuery = P("head")[0].build( "style", { id : idValue, media : query, text :"#" + idValue + "{left:1px}" } );
		this.queryList.push( styleQuery );									// We want to push the element into an array so whenever the window changes it can update the object info.

		return styleQuery;
	},

	removeQuery : function( node )
	{
		var i = this.queryList.indexOf( node );
		this.queryList.splice( i, 1 );
	},

	checkQueryStates : function()
	{
		this.queryList.forEach( function( a )
		{
			if ( a.getAppliedStyle().left == "1px" )
			{
				if ( !a.wasTrue )											// Prevents the event from firing multiple times.
				{
					a.fireObservers( CheckMedia.events.ON_TRUE );
					a.wasTrue = true;
				}
			}
			else if ( a.wasTrue )
			{
				a.fireObservers( CheckMedia.events.ON_FALSE );
				a.wasTrue = false;
			}
		});
	}
};


function pageLoaded()
{
	var testNode = CheckMedia.instance().registerQuery("only screen and (max-width : 767px)");

	testNode.addObserver(CheckMedia.events.ON_TRUE, "mobileView", this);
	testNode.addObserver(CheckMedia.events.ON_FALSE, "leaveMobileView", this);

	CheckMedia.instance().checkQueryStates(); // Tell the query system to update itself to see what its current states are.
}

function mobileView()
{
	console.log("mobile");
}

function leaveMobileView()
{
	console.log("non mobile");
}

window.addEventListener("load", pageLoaded);

var Page = AVObj.extend( { initStaticObject: true, preventExtensions: true } );
Page.properties =
{
	find: function ( nodeName )
	{
		var nodesFound;
		switch ( nodeName.charAt( 0 ) )
		{
			case ".":
				nodesFound = document.getElementsByClassName( nodeName.slice( 1, nodeName.length ) );
				break;
			case "#":
				nodesFound = document.getElementById( nodeName.slice( 1, nodeName.length ) );
				break;
			default:
				nodesFound = document.getElementsByTagName( nodeName );
				break;
		}

		if ( nodesFound.length )
		{
			var nodeArray = [];

			for ( var i = 0; i < nodesFound.length; i++ )
			{
				nodeArray.push( Node.create( nodesFound[i] ) );
			}
			return nodeArray;
		}

		return Node.create( nodesFound );
	},

	build: function ( nodeName, nodeProperties )
	{
		var n = document.createElement( nodeName );
		for ( var i in nodeProperties )
		{
			switch ( i )
			{
				case "text":
					n.appendChild( Page.text(nodeProperties[i]) );			// These two commands should be changed later to something more dom compliant.
					break;
				case "htmlText":
					n.innerHTML = nodeProperties[i];
					break;
				default:
					n.setAttribute( i, nodeProperties[i] );
					break;
			}
		}
		return Node.create( n );
	},


	empty: function ()
	{
		for ( var i = arguments.length; i--; )
			if ( !arguments[i] || arguments[i].length === 0 ) return true;
		return false;
	},

	text: function ( string )
	{
		return document.createTextNode( string );
	}
};

var Node = AVObj.extend( { preventExtensions: true } );
Node.properties =
{
	events:	// List of some common event types used with Elements.
	{
		CLICK: "click",
		MOUSE_DOWN: "mousedown",
		MOUSE_UP: "mouseup",
		MOUSE_MOVE: "mousemove",
		MOUSE_OUT: "mouseout",
		MOUSE_OVER: "mouseover",
		KEY_DOWN: "keydown",
		KEY_PRESS: "keypress",
		KEY_UP: "keyup",
		DBL_CLICK: "dblclick"
	},

	bindedEvents: {},		// Stored to easily remove.

	init: function ( element )
	{
		this.element = element;
	},

	add: function ()
	{
		for ( var i = 0; i < arguments.length; i++ )
		{
			if ( Node.isPrototypeOf( arguments[i] ) )			// Make sure its a prototype of Node.
			{
				this.element.appendChild( arguments[i].element );
			}
			else if ( arguments[i] instanceof Text )
			{
				this.element.appendChild( arguments[i] );
			}
			else
			{
				console.log( "Object argument " + ( i + 1 ) + " is not instance of Node!" );
			}
		}
		return this;
	},

	replace: function ()
	{
		this.clearNodes();
		this.add.apply( this, arguments );
	},

	text: function ( string, isHtml )
	{
		if ( !isHtml )
		{
			this.element.append( Page.text( string ) );
		}
		else
		{
			this.element.innerHTML = strign;
		}
	},

	remove: function ()
	{
		if ( this.element.parentNode )
		{
			this.element.parentNode.removeChild( this.element );
		}
	},
	trim: function ()
	{
		return this.element.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
	},
	getAppliedStyle: function ()
	{
		return window.getComputedStyle( this.element, null );
	},
	clearNodes: function ()
	{
		for ( var i = this.element.childNodes.length; i--; )
			this.element.removeChild( this.element.firstChild );

		return this;
	},
	attribute: function ( name, value )
	{
		var attribute;
		if ( value )
		{
			attribute = this.element.setAttribute( name, value );
		} else
		{
			attribute = this.element.getAttribute( name )
		}
		return attribute;
	},

	rmAttribute: function ( name )
	{
		this.element.removeAttribute( name );
	},

	inDocument: function ()
	{
		var element = this.element;

		while ( element = element.parentNode ) if ( element === document ) return true;

		return false;
	},

	build: function ()
	{
		var n = Page.build.apply( Page, arguments );
		this.element.appendChild( n.element );
		return n;
	},

	node: function ()
	{
		return this.build.apply( this, arguments );
	},

	addNObserver: function ( eventName, functionName, scope )
	{
		if ( !this.bindedEvents[functionName] )
		{
			this.element.addEventListener( eventName, this.bindedEvents[functionName] = this.fireEvent.bind( this, eventName ), false );
		}
		this.addObserver( eventName, functionName, scope );
	},

	removeNObserver: function ( eventName, functionName, scope )
	{
		this.removeObserver( eventName, functionName, scope );
		if ( !this.getNumObservers( eventName ) )
		{
			this.element.removeEventListener( eventName, this.bindedEvents[functionName], false );
			delete this.bindedEvents[functionName];
		}
	},

	removeNObservers: function ( eventName )
	{
		this.removeObservers( eventName );
		for( var func in this.bindedEvents ) {
			this.element.removeEventListener( eventName, this.bindedEvents[func], false );
		}
		delete this.bindedEvents;
	},

	fireEvent: function ( events )
	{
		this.fireObservers( events, event );
	}
};


function node()
{
	return Page.build.apply( Page, arguments );
}

function text()
{
	return Page.text.apply( Page, arguments );
}

function P( nodeName )
{
	return Page.find( nodeName );
}

function empty()
{
	return Page.empty.apply( Page, arguments );
}
"use strict";

XMLHttpRequest.prototype.addListener = function (event, functionName, scope, options)
{
	if(options)
	{
		this['__' + functionName + '_bindValue'] = (scope ? scope[functionName].bind (scope, options) : scope[functionName]);
	}
	else
	{
		this['__' + functionName + '_bindValue'] = (scope ? scope[functionName].bind (scope) : scope[functionName]);
	}
	this.addEventListener (event, this['__' + functionName + '_bindValue'], false);
};
XMLHttpRequest.prototype.removeListener  = function (event, functionName)
{
	this.removeEventListener (event, this['__' + functionName + '_bindValue'], false);
	delete this['__' + functionName + '_bindValue']
};

var Request = AVObj.extend();
Request.properties =
{
	init : function (method, url, asynchronous, finishFunction, data)
	{
		this.request = new XMLHttpRequest ();
		this.method = method;
		this.url = url;
		this.asynchronous = asynchronous;
		this.finishFunction = finishFunction;
		this.data = data;
		if (this.request == null)
		{
			console.error ("Browser does not support XMLHTTPRequest.");
		}
		else if (typeof url === 'string')
		{
			this.request.addListener ("error", 'transferError', this);
			if (method === "POST")
			{
				this.sendPostRequest ();
			}
			else if (method === "GET")
			{
				this.sendGetRequest ();
			}
			else
			{
				console.error ("no method defined. Please set to \"POST\" or \"GET\".");
			}
		}
		else
		{
			console.error ("URL is not defined or is not a string.");
		}
	},

	transferError : function()
	{
		console.error ("An error has occurred while transferring the data.");
	},

	sendGetRequest : function()
	{
		this.request.open (this.method, this.url + "?" + this.convertToString (), this.asynchronous);
		if (!this.asynchronous)
		{
			this.request.send (null);
			this.finishFunction ({responseText : this.request.responseText});
		}
		else
		{

			this.request.addListener ("load", 'fireFunction', this);
			this.request.send (null);
		}
	},

	sendPostRequest : function()
	{
		this.request.open (this.method, this.url, this.asynchronous);
		if (!this.asynchronous)
		{
			this.request.send (this.convertToForm ());
			this.finishFunction ({responseText : this.request.responseText});
		}
		else
		{
			this.request.addListener ("load", 'fireFunction', this);
			this.request.send (this.convertToForm ());
		}
	},

	fireFunction : function( e )
	{
		this.request.removeListener ("error", 'transferError');
		this.request.removeListener ("load", 'fireFunction');
		this.finishFunction (e.currentTarget);
	},

	kill : function()
	{
		this.request.removeListener ("error", 'transferError');
		this.request.removeListener ("load", 'fireFunction');
		this.request.abort ();
	},

	convertToString : function ()
	{
		var newString = "";
		if (typeof this.data == "object")
		{
			var firstAnd = false;
			for (var element in this.data)
			{
				if (firstAnd)
				{
					newString += "&" + element + "=" + encodeURIComponent (this.data[element]);
				}
				else
				{
					firstAnd = true;
					newString += element + "=" + encodeURIComponent (this.data[element]);
				}
			}
		}
		else if (typeof this.data == 'string') newString = this.data;

		return newString;
	},

	convertToForm : function()
	{
		var object;
		if (typeof this.data == "object" && typeof FormData != 'undefined')
		{
			if (this.data instanceof FormData === false)
			{
				object = new FormData ();
				for (var element in this.data)
				{ //noinspection JSUnfilteredForInLoop
					object.append (element, this.data[element]);
				}
			}
			else
			{
				object = this.data;
			}
		}
		else object = this.convertToString();

		if (typeof object == 'string')
			this.request.setRequestHeader ("Content-type", "application/x-www-form-urlencoded");

		return object;
	}
};
