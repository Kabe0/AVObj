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

// We are promising the JavaScript compiler that all the values will exists later on.
namespace( "AVObj.Utilities", function()
{
	this.Page = null;
	this.Node = null;
	this.node = null;
	this.text = null;
	this.P = null;
	this.empty = null;
	this.cakeStuff = true;
});

usingNamespace( "AVObj.Utilities", function()
{
	/**
	 * @class
	 * @staticclass
	 * @classdesc The Page Class handles {@link node} creation and management.
	 * @extends AVObj
	 */
	Page = AVObj.extend( { initStaticObject: true, preventExtensions: true } ).prop(
	{
			/**
			 * Used to find a {@link Node} on the current document using one of the methods below...
			 * <table class="params">
			 *     <thead>
			 *     <tr><th>Search Value</th><th>Description</th></tr>
			 *     </thead>
			 *     <tbody>
			 *     <tr><td><code>.{string]</code></th><td>stands for class name and returns array of nodes.</td></tr>
		 *     <tr><td><code>#{string]</code></th><td>stands for ID name and returns one node.</td></tr>
		 *     <tr><td><code>{string]</code></th><td>No symbol proceeding stands for tag name.</td></tr>
		 *     </tbody>
		 * </table>
		 *
		 * @see P
			 * @param {string} nodeName    The name of the object you want to find.
			 * @param {element} [parent=document] value that can be defined to search through a specified object.
			 * @returns {Node|Node[]}
			 * @memberof Page
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

				if ( !nodeFound )
				{
					console.error( "Node/nodes do not exist by that name!" );
					return;
				}

				return Page.generateNodeFromElements( nodeFound );
			},

			/**
			 * Generates {@link Node} objects from elements passed in by the parameter nodeObjects.
			 * @param {element|element[]} nodeObjects The objects that need to be encased (if not already) in a {@link Node} object.
			 * @returns {Node|Node[]} Object returned is same size as the object passed into the function.
			 * @memberof Page
			 */
			generateNodeFromElements: function ( nodeObjects )
			{
				// If more than one element was returned, shove them all into an array instead of an object.
				if ( nodeObjects.length )
				{
					var nodeArray = [];

					for ( var i = 0; i < nodeObjects.length; i++ )
					{
						nodeArray.push( ( !nodeObjects[i]._nodeDat ? Node.create( nodeObjects[i] ) : nodeObjects[i]._nodeDat ) );
					}
					return nodeArray;
				}

				return ( !nodeObjects._nodeDat ? AVObj.Utilities.Node.create( nodeObjects ) : nodeObjects._nodeDat );
			},

			/**
			 * Creates a new {@link Node} and element that is unattached.
			 * @param {string} nodeName Name of the node tage you want to build.
			 * @param {object} nodeProperties The different attributes of the node. Object names text and htmlText will allow you to input string directly into the object.
			 * @returns {Node}
			 * @memberof Page
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
						n.appendChild( AVObj.Utilities.text( nodeProperties[i] ) );			// These two commands should be changed later to something more dom compliant.
						break;
					case "htmlText":
						n.innerHTML = nodeProperties[i];
						break;
					default:
						n.setAttribute( i, nodeProperties[i] );
						break;
					}
				}
				console.log("Node" + Node);
				return Node.create( n );
			},


			/**
			 * Checks if the variable is a string that is empty.
			 * @param {String} arguments The value you want to determine if its empty or not.
			 * @return {Boolean} sets to true if the string is empty.
			 * @memberof Page
			 */
			empty: function ()
			{
				for ( var i = arguments.length; i--; )
					if ( !arguments[i] || arguments[i].length === 0 ) return true;
				return false;
			},

			/**
			 * Returns a new text node.
			 * @param {string} string
			 * @returns {Text}
			 * @memberof Page
			 */
			text: function ( string )
			{
				return document.createTextNode( string );
			}
		});

	Node = AVObj.extend( { preventExtensions: false } ).prop(
	{
		events: {
			/**
			 * List of some common event types used with Elements.
			 * You may also use the string value instead of the enum value.
			 *
			 * @enum {string}
			 * @memberof Node
			 * @alias events
			 */
			value:        {
				/** Fired whenever the mouse is pressed down */
				CLICK:      "click",
				MOUSE_DOWN: "mousedown",
				MOUSE_UP:   "mouseup",
				MOUSE_MOVE: "mousemove",
				MOUSE_OUT:  "mouseout",
				MOUSE_OVER: "mouseover",
				KEY_DOWN:   "keydown",
				KEY_PRESS:  "keypress",
				KEY_UP:     "keyup",
				DBL_CLICK:  "dblclick"
			},
			writable:     false,
			configurable: false
		},

		/**
		 * Creates the class Node object to wrap around an Element. Call Page.build to construct a new element.
		 *
		 * @extends AVObj
		 * @see Page.build
		 * @param {element} Element Defines the element that will be encapsulated by the Node class.
		 * @constructor Node
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
		deInit: function ()
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
		 * @instance
		 * @memberof Node
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

		/**
		 * @instance
		 * @memberof Node
		 */
		replace: function ()
		{
			this.clearNodes();
			this.add.apply( this, arguments );
		},

		/**
		 * Removes the node from its parent element without destroying the node.
		 * @memberof Node
		 * @instance
		 */
		remove: function ()
		{
			if ( this.element.parentNode )
			{
				this.element.parentNode.removeChild( this.element );
			}
		},

		/**
		 * Finds the first child or children's it can find based on nodeName filter.
		 * @see Page.find
		 * @see P
		 * @param nodeName the name of the node you want to find.
		 * @returns {Node|Node[]}
		 * @instance
		 * @memberof Node
		 */
		find: function ( nodeName )
		{
			return Page.find( nodeName, this.element );
		},

		/**
		 * Creates
		 * @param nodeName the name of the node you want to find.
		 * @returns {Node|Node[]}
		 * @see Page.find
		 * @see P
		 * @see Node#find
		 * @instance
		 * @memberof Node
		 */
		P: function ( nodeName )
		{
			return this.find( nodeName );
		},

		/**
		 * Grabs a list of the first layer of child elements in the object
		 * @member {Node[]} <u>getter</u>-children
		 * @memberof Node
		 * @instance
		 */
		children: {
			get: function ()
			{
				return Page.generateNodeFromElements( this.element.childNodes );
			}
		},

		/**
		 * Deletes all the nodes inside the object.
		 * Any Nodes defined will get automatically destroyed unless nonDestructive is set to true
		 * in the main function param.
		 *
		 * @instance
		 * @memberof Node
		 */
		clearNodes: function ( nonDestructive )
		{
			// Recursive loop for destroying all nodes.
			var privateDestruction = function ( parentNode )
			{
				// Find all children
				for ( var i = parentNode.childNodes.length; i--; )
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
				}
			}

			return this;
		},

		/**
		 * replaces the contents of the node with text.
		 * @param string The value to add
		 * @param isHtml Determine if its html or plane text.
		 * @instance
		 * @memberof Node
		 */
		text: function ( string, isHtml )
		{
			if ( !isHtml )
			{
				this.element.append( Page.text( string ) );
			}
			else
			{
				this.element.innerHTML = string;
			}
		},

		/**
		 * Returns the content inside the node as an html string.
		 * @returns {string|innerHTML}
		 * @instance
		 * @memberof Node
		 */
		getText: function ()
		{
			return this.element.innerHTML;
		},

		/**
		 * Trims any space (text nodes) at the start and end of the element.
		 * @returns {*}
		 * @instance
		 * @memberof Node
		 */
		trim:            function ()
		{
			return this.element.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
		},
		/**
		 *
		 * @returns {CSSStyleDeclaration}
		 * @instance
		 * @memberof Node
		 */
		getAppliedStyle: function ()
		{
			return window.getComputedStyle( this.element, null );
		},
		/**
		 *
		 * @returns {Number}
		 * @instance
		 * @memberof Node
		 */
		getWidth:        function ()
		{
			var val = window.getComputedStyle( this.element, null ).width;

			return parseInt( val.slice( 0, val.length - 2 ) );
		},

		/**
		 * @returns {Number}
		 * @instance
		 * @memberof Node
		 */
		getHeight: function ()
		{
			var val = window.getComputedStyle( this.element, null ).height;

			return parseInt( val.slice( 0, val.length - 2 ) );
		},

		/**
		 * Allows the creation and retrieval of attributes.
		 * @param name Name of the attribute you want to grab
		 * @param value A new value to set the attribute to
		 * @returns {*}
		 * @instance
		 * @memberof Node
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
		 * @instance
		 * @memberof Node
		 */
		rmAttribute: function ( name )
		{
			this.element.removeAttribute( name );
		},

		/**
		 * Used to determine if the node has been appended to the document or if its only being stored as a Javascript object.
		 * @returns {boolean}
		 * @instance
		 * @memberof Node
		 */
		inDocument: function ()
		{
			var element = this.element;

			while ( element = element.parentNode ) if ( element === document ) return true;

			return false;
		},

		/**
		 * Constructs a node and appends it to this current node. See Page.build to build a node that won't append to this one.
		 * @param {string} nodeName The name of the node you want to create.
		 * @param {object} nodeProperties the properties for the node being built.
		 * @see Page.build
		 * @see Node#node
		 * @returns {Node}
		 * @instance
		 * @memberof Node
		 */
		build: function ( nodeName, nodeProperties )
		{
			var n = Page.build.apply( Page, arguments );
			this.element.appendChild( n.element );
			return n;
		},

		/**
		 * Alternative to the 'build' command but with the same results.
		 * @param {string} nodeName The name of the node you want to create.
		 * @param {object} nodeProperties the properties for the node being built.
		 * @returns {Node}
		 * @see Page.build
		 * @see Node#build
		 * @instance
		 * @memberof Node
		 */
		node: function ( nodeName, nodeProperties )
		{
			return this.build.apply( this, arguments );
		},

		/**
		 * Adds an EventListener but wrapped with the Observer model.
		 * @param eventName Name of the event to broadcast (see this object's events for available options)..
		 * @param functionName Name of the function to call.
		 * @param scope Where the function is located.
		 * @instance
		 * @memberof Node
		 */
		addNObserver: function ( eventName, functionName, scope, data )
		{
			// Create the initial even if it does not exist.
			if ( !this.bindedEvents[functionName] )
			{
				var bindedObject = this.bindedEvents[functionName] = { eventName: eventName, function: this.fireEvent.bind( this, eventName, data ) };
				this.element.addEventListener( eventName, bindedObject.function, false );
			}
			this.addObserver( eventName, functionName, scope );
		},

		/**
		 * Removes an EventListener that was wrapped with the Observer model.
		 * @param eventName Name of the event that contains the observer (see this object's events for available options).
		 * @param functionName The bounded function to remove.
		 * @param scope The scope of the class it was attached to.
		 * @instance
		 * @memberof Node
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
		 * @instance
		 * @memberof Node
		 */
		removeNObservers: function ( eventName )
		{
			this.removeObservers( eventName );
			for ( var functName in this.bindedEvents )
			{
				if ( this.bindedEvents[functName].eventName == eventName )
				{
					this.element.removeEventListener( eventName, this.bindedEvents[functName].function, false );
				}
			}
			delete this.bindedEvents;
		},

		/**
		 * Destroys all node observers attached to this object.
		 * @instance
		 * @memberof Node
		 */
		clearNObservers: function ()
		{
			for ( var functName in this.bindedEvents )
			{
				var bindedEvent = this.bindedEvents[functName];

				this.removeObservers( bindedEvent.eventName );
				this.element.removeEventListener( bindedEvent.eventName, bindedEvent.function );
			}
		},

		// Internal command don't fire!
		fireEvent:       function ( events, data, e )
		{
			this.fireObservers( events, e, data );
		}
	});

	//console.log( Page, "stuff");
	///////////////////////////////////////
	//
	//		macro - functions...
	//
	///////////////////////////////////////

	/**
	 * Shortcut for {@link Page.build} command.
	 * @see Page.build
	 * @param {string} nodeName
	 * @param {object} nodeProperties
	 * @returns {Node}
	 */
	node = function ( nodeName, nodeProperties )
	{
		cakeStuff = false;
		return Page.build.apply( Page, arguments );
	};

	/**
	 * Shortcut for {@link Page.text} command.
	 * @see Page.text
	 * @param {string} string
	 * @returns {Text}
	 */
	text = function ( string )
	{
		return Page.text.apply( Page, arguments );
	};

	/**
	 * Shortcut for {@link Page.find} command.
	 * @see Page.find
	 * @param {string} nodeName node to look for.
	 * @param {element} parent
	 * @returns {Node|Node[]}
	 */
	P = function ( nodeName, parent )
	{
		return Page.find.apply( nodeName, arguments );
	};

	/**
	 * Shortcut to {@link Page.empty} command.
	 * @see Page.empty
	 * @returns {Boolean|*|boolean}
	 */
	empty = function ()
	{
		return Page.empty.apply( Page, arguments );
	};

});