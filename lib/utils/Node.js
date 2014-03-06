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

var Page = AVObj.extend( { initStaticObject: true, preventExtensions: true } );
Page.properties =
{
	/**
	 * Used to find a node on the current document using one of the methods below...
	 * . stands for Class name and returns an array of nodes
	 * # stands for ID name and returns one node
	 * No value stands for Tag name and returns an array of nodes.
	 * @see P
	 * @param nodeName
	 * @returns {*}
	 */
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

		// If more than one element was returned, shove them all into an array instead of an object.
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

	/**
	 * Creates a new Node object.
	 * @param nodeName Name of the node tage you want to build.
	 * @param nodeProperties The different attributes of the node. Object names text and htmlText will allow you to input string directly into the object.
	 * @returns {n}
	 */
	build: function ( nodeName, nodeProperties )
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
		return Node.create( n );
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

	/**
	 * Returns a new string node.
	 * @param string
	 * @returns {Text}
	 */
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

	/**
	 * Creates the class Node object to wrap around an Element. Call Page.build to construct a new element.
	 * @see Page.build
	 * @param element Element to wrap around.
	 * @constructor
	 */
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

	/**
	 * replaces the contents of the node with text.
	 * @param string The value to add
	 * @param isHtml Determine if its html or plane text.
	 */
	text: function ( string, isHtml )
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

	/**
	 * Removes the node from its parent (Must be attached to something first!).
	 */
	remove: function ()
	{
		if ( this.element.parentNode )
		{
			this.element.parentNode.removeChild( this.element );
		}
	},
	/**
	 * Trims any space (text nodes) at the start and end of the element.
	 * @returns {*}
	 */
	trim: function ()
	{
		return this.element.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
	},
	/**
	 *
	 * @returns {CSSStyleDeclaration}
	 */
	getAppliedStyle: function ()
	{
		return window.getComputedStyle( this.element, null );
	},
	/**
	 * Deletes all the nodes inside the object.
	 */
	clearNodes: function ()
	{
		for ( var i = this.element.childNodes.length; i--; )
			this.element.removeChild( this.element.firstChild );
	},
	/**
	 * Allows the creation and retrieval of attributes.
	 * @param name Name of the attribute you want to grab
	 * @param value A new value to set the attribute to
	 * @returns {*}
	 */
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

	/**
	 * Destroys the given attribute.
	 * @param name Name of the attribute you want to remove.
	 */
	rmAttribute: function ( name )
	{
		this.element.removeAttribute( name );
	},

	/**
	 * Used to determine if the node has been appended to the document or if its only being stored as a Javascript object.
	 * @returns {boolean}
	 */
	inDocument: function ()
	{
		var element = this.element;

		while ( element = element.parentNode ) if ( element === document ) return true;

		return false;
	},

	/**
	 * Constructs a node and appends it to this current node. See Page.build to build a node that won't append to this one.
	 * @see Page.build
	 * @returns {n|*}
	 */
	build: function ()
	{
		var n = Page.build.apply( Page, arguments );
		this.element.appendChild( n.element );
		return n;
	},

	/**
	 * Alternative to the 'build' command but with the same results.
	 * @returns {n|*}
	 */
	node: function ()
	{
		return this.build.apply( this, arguments );
	},

	/**
	 * Adds an EventListener but wrapped with the Observer model.
	 * @param eventName Name of the event to broadcast.
	 * @param functionName Name of the function to call.
	 * @param scope Where the function is located.
	 */
	addNObserver: function ( eventName, functionName, scope )
	{
		// Create the initial even if it does not exist.
		if ( !this.bindedEvents[functionName] )
		{
			this.element.addEventListener( eventName, this.bindedEvents[functionName] = this.fireEvent.bind( this, eventName ), false );
		}
		this.addObserver( eventName, functionName, scope );
	},

	/**
	 * Removes an EventListener that was wrapped with the Observer model.
	 * @param eventName Name of the event that contains the observer
	 * @param functionName The bounded function to remove.
	 * @param scope The scope of the class it was attached to.
	 */
	removeNObserver: function ( eventName, functionName, scope )
	{
		this.removeObserver( eventName, functionName, scope );
		// Check bind length, before removing event.
		if ( this.getNumObservers( eventName ) )
		{
			this.element.removeObserver( eventName, this.bindedEvents[functionName], false );
			delete this.bindedEvents[functionName];
		}
	},

	/**
	 * Removes all the observers attached to an event.
	 * @param eventName The event to remove.
	 */
	removeMObservers: function ( eventName )
	{
		this.removeObservers( eventName );
		this.element.removeObserver( eventName, this.bindedEvents[functionName], false );
		delete this.bindedEvents[functionName];
	},

	// Internal command don't fire!
	fireEvent: function ( events )
	{
		this.fireObservers( events, event );
	}
};

///////////////////////////////////////
//
//		macro - functions...
//
///////////////////////////////////////

/**
 * Shortcut for Page.build command.
 * @see Page.build
 * @returns {n|n|*}
 */
function node()
{
	return Page.build.apply( Page, arguments );
}

/**
 * Shortcut for Page.text command.
 * @see Page.text
 * @returns {Text|*|XMLList}
 */
function text()
{
	return Page.text.apply( Page, arguments );
}

/**
 * Shortcut for Page.find command.
 * @see Page.find
 * @param nodeName node to look for.
 * @returns {*}
 */
function P( nodeName )
{
	return Page.find( nodeName );
}

/**
 * Shortcut to Page.empty command.
 * @see Page.empty
 * @returns {Boolean|*|boolean}
 */
function empty()
{
	return Page.empty.apply( Page, arguments );
}
