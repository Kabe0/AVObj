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
 * Handles media creation
 * @property {object} CheckMedia.events				- Available event types.
 * @class
 *
 */
// We are promising the JavaScript compiler that all the values will exists later on.
namespace( "AVObj.Utilities", function()
{
	this.CheckMedia = AVObj.extend( { generateSingleton: true } ).prop(
	{

		head: null,															// Location where query nodes are created.

		/**
		 * Avaiable Observer events to listen to.
		 * @memberof CheckMedia
		 * @enum
		 */
		events: {																// List of available events you can listen to (used on the query objects).
			/**
			 * List of some common event types used with Elements.
			 * You may also use the string value instead of the enum value.
			 *
			 * @enum {string}
			 * @memberof CheckMedia
			 * @alias events
			 */
			value:        {
				ON_TRUE:   "onTrue",
				ON_FALSE:  "onFalse",
				ON_CHANGE: "onChange"
			},
			writable:     false,
			configurable: false
		},

		// Recommended to call the instance() method instead of creating individual CheckMedia objects.
		init:   function ()
		{
			this.queryList = [];												// List of all the query objects that the class has.
			// We have to scope it to the object to retain instance objects.
			window.addEventListener( "resize", this.checkQueryStates.bind( this ) );
		},

		/**
		 * Creates a new query object and returns the node with the ObserverModel attached to it.
		 * @param query Condition you want to check.
		 * @memberof CheckMedia
		 */
		registerQuery: function ( query )
		{

			var idValue = "_CheckMediaN" + this.queryList.length;

			var styleQuery = P( "head" )[0].build( "style", { id: idValue, media: query, text: "#" + idValue + "{left:1px}" } );
			this.queryList.push( styleQuery );									// We want to push the element into an array so whenever the window changes it can update the object info.

			return styleQuery;
		},

		/**
		 * Deletes the node and prevents it from being apart of the checkQueryStates update call.
		 * @param node
		 * @memberof CheckMedia
		 */
		removeQuery: function ( node )
		{
			var i = this.queryList.indexOf( node );
			this.queryList.splice( i, 1 );
		},

		/**
		 * Called automatically on resize to determine what the state of the query's are, but can also be called manually if need be.
		 */
		checkQueryStates: function ()
		{
			this.queryList.forEach( function ( a )
			{
				if ( a.getAppliedStyle().left == "1px" )
				{
					if ( !a.wasTrue )											// Prevents the event from firing multiple times.
					{
						a.fireObservers( CheckMedia.events.ON_TRUE );
						a.fireObservers( CheckMedia.events.ON_CHANGE, true );
						a.wasTrue = true;
					}
				}
				else if ( a.wasTrue )
				{
					a.fireObservers( CheckMedia.events.ON_FALSE );
					a.fireObservers( CheckMedia.events.ON_CHANGE, false );
					a.wasTrue = false;
				}
			} );
		}
	});
});
	/**
	 * Example test code here showing a possible mobile view check.
	 *
	 *function pageLoaded()
	 *{
*	var testNode = CheckMedia.instance.registerQuery("only screen and (max-width : 767px)");
*
*	testNode.addObserver(CheckMedia.events.ON_TRUE, "mobileView", this);
*	testNode.addObserver(CheckMedia.events.ON_FALSE, "leaveMobileView", this);
*
*	CheckMedia.instance.checkQueryStates(); // Tell the query system to update itself to see what its current states are.
*}
	 *
	 *function mobileView()
	 *{
*	console.log("mobile");
*}
	 *
	 *function leaveMobileView()
	 *{
*	console.log("non mobile");
*}
	 *
	 *window.addEventListener("load", pageLoaded);
	 **/

