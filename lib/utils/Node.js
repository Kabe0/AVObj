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
 * The Page Class handles node creation and management, such as unlinking when a node is removed.
 * @type {*|void}
 */
var Page = AVObj.extend( { initStaticObject : true, preventExtensions : true } );
Page.properties =
{
	/**
	 * Used to find a node on the current document using one of the methods below...
	 * . stands for Class name and returns an array of nodes
	 * # stands for ID name and returns one node
	 *   No symbol proceeding stands for tag name
	 *   Blank nodeName will grab all child nodes in the object.
	 *
	 * No value stands for Tag name and returns an array of nodes.
	 * @see P
	 * @param nodeName
	 * @param parent	Optional
	 * @returns {*}
	 */
	find: function ( nodeName, parent )
	{
		parent = ( parent == null ? document : parent );	// Make sure parent is defined

		var nodeFound;	// Stores all the nodes found.

		// Determine if the nodeName value was even defined... If not, just return all the object's children.
		if ( nodeName != null && nodeName.length > 0 )
		{
			switch ( nodeName.charAt( 0 ) )
			{
				case ".":
					nodeFound = parent.getElementsByClassName( nodeName.slice( 1, nodeName.length ) );
					break;
				case "#":
					nodeFound = parent.getElementById( nodeName.slice( 1, nodeName.length ) );
					break;
				default:
					if ( nodeName != null && nodeName.length > 0 )
					{
						nodeFound = parent.getElementsByTagName( nodeName );
					}
					break;
			}
		}
		else
		{
			nodeFound = parent.childNodes;
		}

		if ( !nodeFound ){
			console.error("Node/nodes do not exist by that name!");
			return;
		}

		// If more than one element was returned, shove them all into an array instead of an object.
		if ( nodeFound.length )
		{
			var nodeArray = [];

			for ( var i = 0; i < nodeFound.length; i++ )
			{
				nodeArray.push( ( !nodeFound[i]._nodeDat ? Node.create( nodeFound[i] ) : nodeFound[i]._nodeDat ) );
			}
			return nodeArray;
		}

		return ( !nodeFound._nodeDat ? Node.create( nodeFound ) : nodeFound._nodeDat );
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

var Node = AVObj.extend( { preventExtensions: false } );
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

	/**
	 * Creates the class Node object to wrap around an Element. Call Page.build to construct a new element.
	 * @see Page.build
	 * @param element Element to wrap around.
	 * @constructor
	 */
	init: function ( element )
	{
		this.bindedEvents = {};

		this.element = element;
		this.element._nodeDat = this;	// Double references are not good...
	},

	/**
	 * Call deInit when you want to fully destroy the element.
	 */
	deInit: function()
	{
		this.clearNodes();
		this.remove();
		this.clearNObservers();

		delete this.element._nodeDat;
		delete this.element;
		delete this.bindedEvents;
	},

	/**
	 * Add a list of nodes.
	 * @returns {Node.properties}
	 */
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
	 * Removes the node from its parent element without destroying the node.
	 */
	remove: function ()
	{
		if ( this.element.parentNode )
		{
			this.element.parentNode.removeChild( this.element );
		}
	},

	find : function ( nodeName )
	{
		return Page.find( nodeName, this.element );
	},

	children :
	{
		get : function()
		{
			return this.find();
		}
	},

	/**
	 * Deletes all the nodes inside the object.
	 * Any Nodes defined will get automatically destroyed unless nonDestructive is set to true
	 * in the main function param.
	 */
	clearNodes: function ( nonDestructive )
	{
		// Recursive loop for destroying all nodes.
		var privateDestruction = function( parentNode )
		{
			// Find all children
			for( var i = parentNode.childNodes.length; i--; )
			{
				var childNode = parentNode.childNodes[i];
				// If a nodeDat exists, then just destroy it as that will destroy it's children
				// automatically.
				if ( childNode._nodeDat )
				{
					if ( !nonDestructive )
					{
						childNode._nodeDat.destroy();
					}
					else
					{
						childNode._nodeDat.remove();
					}
				}
				else
				{
					privateDestruction( childNode );
					parentNode.removeChild( childNode );
				}
			}
		};

		for ( var i = this.element.childNodes.length; i--; )
		{
			var childNode = this.element.childNodes[i];
			if ( childNode._nodeDat)
			{
				if ( !nonDestructive )
				{
					childNode._nodeDat.destroy();
				}
				else
				{
					childNode._nodeDat.remove();
				}
			}
			else
			{
				privateDestruction( childNode );
			}
		}

		return this;
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
			this.element.append( Page.text( string ) );
		}
		else
		{
			this.element.innerHTML = strign;
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

	getWidth : function()
	{
		var val = window.getComputedStyle( this.element , null ).width;

		return parseInt(val.slice( 0, val.length - 2 ));
	},

	getHeight : function()
	{
		var val = window.getComputedStyle( this.element , null ).height;

		return parseInt(val.slice( 0, val.length - 2 ));
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
		if ( value != null )
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
	build: function ( nodeName, nodeProperties)
	{
		var n = Page.build.apply( Page, arguments );
		this.element.appendChild( n.element );
		return n;
	},

	/**
	 * Alternative to the 'build' command but with the same results.
	 * @returns {n|*}
	 */
	node: function ( nodeName, nodeProperties )
	{
		return this.build.apply( this, arguments );
	},

	P : function ( nodeName )
	{
		return this.find( nodeName );
	},

	/**
	 * Adds an EventListener but wrapped with the Observer model.
	 * @param eventName Name of the event to broadcast (see this object's events for available options)..
	 * @param functionName Name of the function to call.
	 * @param scope Where the function is located.
	 */
	addNObserver: function ( eventName, functionName, scope, data )
	{
		// Create the initial even if it does not exist.
		if ( !this.bindedEvents[functionName] )
		{
			var bindedObject = this.bindedEvents[functionName] = { eventName : eventName, function : this.fireEvent.bind( this, eventName, data ) };
			this.element.addEventListener( eventName, bindedObject.function, false );
		}
		this.addObserver( eventName, functionName, scope );
	},

	/**
	 * Removes an EventListener that was wrapped with the Observer model.
	 * @param eventName Name of the event that contains the observer (see this object's events for available options).
	 * @param functionName The bounded function to remove.
	 * @param scope The scope of the class it was attached to.
	 */
	removeNObserver: function ( eventName, functionName, scope )
	{
		this.removeObserver( eventName, functionName, scope );
		// Check bind length, before removing event.
		if ( !this.getNumObservers( eventName ) )
		{
			this.element.removeEventListener( eventName, this.bindedEvents[functionName].function, false );
			delete this.bindedEvents[functionName];
		}
	},

	/**
	 * Removes all the observers attached to an event.
	 * @param eventName The event to remove (see this object's events for available options).
	 */
	removeNObservers: function ( eventName )
	{
		this.removeObservers( eventName );
		for( var functName in this.bindedEvents ) {
			if ( this.bindedEvents[functName].eventName == eventName )
			{
				this.element.removeEventListener( eventName, this.bindedEvents[functName].function, false );
			}
		}
		delete this.bindedEvents;
	},

	/**
	 * Destroys all node observers attached to this object.
	 */
	clearNObservers : function()
	{
		for( var functName in this.bindedEvents )
		{
			var bindedEvent = this.bindedEvents[functName];

			this.removeObservers( bindedEvent.eventName );
			this.element.removeEventListener(bindedEvent.eventName, bindedEvent.function);
		}
	},

	// Internal command don't fire!
	fireEvent: function ( events, data, e )
	{
		this.fireObservers( events, e, data );
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
