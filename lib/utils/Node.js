/**
 * User: Ian
 * Date: 03/05/14
 * Time: 7:15 PM
 * Project: AVObj vs 0.01 - Making JS Simple.
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * This js file contains additional functionality for the Element class that are useful when used in conjuntion with
 * AVObj.
 */

var Page = AVObj.extend( { initStaticObject : true, preventExtensions : true } );
Page.properties =
{
	find : function( nodeName )
	{
		var nodesFound;
		switch (nodeName.charAt(0))
		{
			case ".":
				nodesFound = document.getElementsByClassName(nodeName.slice(1, nodeName.length));
				break;
			case "#":
				nodesFound = document.getElementById(nodeName.slice(1, nodeName.length));
				break;
			default:
				nodesFound = document.getElementsByTagName(nodeName);
				break;
		}

		// If more than one element was returned, shove them all into an array instead of an object.
		if ( nodesFound.length )
		{
			var nodeArray = [];

			for ( var i = 0; i < nodesFound.length; i++ )
			{
				nodeArray.push( Node.create(nodesFound[i]) );
			}
			return nodeArray;
		}

		return Node.create(nodesFound);
	},

	build : function( nodeName, nodeProperties )
	{
		var n = document.createElement( nodeName );
		for ( var i in nodeProperties )
		{
			//noinspection JSUnfilteredForInLoop
			switch ( i )
			{
				case "text":
					n.innerText = nodeProperties[i];			// These two commands should be changed later to something more dom compliant.
					break;
				case "htmlText":
					n.innerHTML = nodeProperties[i];
					break;
				default:
					n.setAttribute( i, nodeProperties[i] );
					break;
			}
		}
		return Node.create(n);
	},

	/**
	 * Checks if the variable is a string that is empty.
	 * @param {String} arguments The value you want to determine if its empty or not.
	 * @return {Boolean} sets to true if the string is empty.
	 */
	empty: function ()
	{
		for ( var i = arguments.length; i--; )
			if ( !arguments[i] || arguments[i].length === 0 ) return true;
		return false;
	},

	text : function( string )
	{
		return document.createTextNode( string );
	}
};

var Node = AVObj.extend( { preventExtensions : true } );
Node.properties =
{
	events :
	{
		CLICK : "click",
		MOUSE_DOWN : "mousedown",
		MOUSE_UP : "mouseup",
		MOUSE_MOVE : "mousemove",
		MOUSE_OUT : "mouseout",
		MOUSE_OVER : "mouseover",
		KEY_DOWN : "keydown",
		KEY_PRESS : "keypress",
		KEY_UP : "keyup",
		DBL_CLICK : "dblclick"
	},

	bindedEvents : {},

	init : function( element )
	{
		this.element = element;
	},

	add : function()
	{
		for ( var i = 0; i < arguments.length; i++ )
		{
			if ( Node.isPrototypeOf(arguments[i]) )			// Make sure its a prototype of Node.
			{
				this.element.appendChild( arguments[i].element );
			}
			else if ( arguments[i] instanceof Text )
			{
				this.element.appendChild( arguments[i]);
			}
			else
			{
				console.log("Object argument " + ( i + 1 ) + " is not instance of Node!");
			}
		}
		return this;
	},

	replace : function()
	{
		this.clearNodes();
		this.add.apply(this, arguments);
	},

	text : function ( string, isHtml )
	{
		if ( !isHtml )
		{
			this.element.innerText = string;
		}
		else
		{
			this.element.innerHTML = strign;
		}
	},

	remove : function()
	{
		if(this.element.parentNode) {
			this.element.parentNode.removeChild (this.element);
		}
	},

	trim : function ()
	{
		return this.element.replace (/^\s\s*/, '').replace (/\s\s*$/, '');
	},

	getAppliedStyle : function()
	{
		return window.getComputedStyle(this.element, null);
	},

	clearNodes : function ()
	{
		for (var i = this.element.childNodes.length; i--;)
			this.element.removeChild (this.element.firstChild);
	},

	attribute : function( name, value )
	{
		var attribute;
		if ( value ) {
			attribute = this.element.setAttribute(name, value);
		} else {
			attribute = this.element.getAttribute(name)
		}
		return attribute;
	},

	rmAttribute : function ( name )
	{
		this.element.removeAttribute( name );
	},

	inDocument : function()
	{
		var element = this.element;

		while (element = element.parentNode) if (element === document) return true;

		return false;
	},

	build : function ()
	{
		var n = Page.build.apply( Page, arguments );
		this.element.appendChild( n.element );
		return n;
	},

	node : function()
	{
		this.build.apply( this, arguments );
	},

	addNObserver : function( eventName, functionName, scope )
	{
		// Create the initial even if it does not exist.
		if ( !this.bindedEvents[functionName] ) {
			this.element.addEventListener( eventName, this.bindedEvents[functionName] = this.fireEvent.bind(this, eventName), false);
		}
		this.addObserver( eventName, functionName, scope );
	},

	removeNObserver : function( eventName, functionName, scope )
	{
		this.removeObserver( eventName, functionName, scope );
		// Check bind length, before removing event.
		if ( this.getNumObservers(eventName) ) {
			this.element.removeObserver( eventName, this.bindedEvents[functionName], false);
			delete this.bindedEvents[functionName];
		}
	},

	removeMObservers : function ( eventName )
	{
		this.removeObservers( eventName );
		this.element.removeObserver( eventName, this.bindedEvents[functionName], false);
		delete this.bindedEvents[functionName];
	},

	fireEvent : function ( events )
	{
		this.fireObservers( events, event );
	}
};

///////////////////////////////////////
//
//		macro - functions...
//
///////////////////////////////////////

function node()
{
	return Page.build.apply( Page, arguments );
}

function text()
{
	return Page.text.apply( Page, arguments );
}

//Partially imitates the selector syntax as in JQuery other than the return object being different.
function P ( nodeName )
{
	return Page.find( nodeName );
}

function empty ()
{
	return Page.empty.apply( Page, arguments );
}
