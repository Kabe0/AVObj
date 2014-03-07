/**
 * Created by Ian Carson on 3/2/2014.
 * Project: AVObj vs 0.4 - Making JS Simple.
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Used to determine the view type using CSS Media Querys.
 */
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

	/**
	 * Recommended to call the instance() method instead of creating individual CheckMedia objects.
	 * @constructor
 	 */
	init : function()
	{
		// We have to scope it to the object to retain instance objects.
		window.addEventListener( "resize", this.checkQueryStates.bind( this ) );
	},

	/**
	 * Creates a new query object and returns the node with the ObserverModel attached to it.
	 * @param query Condition you want to check.
	 */
	registerQuery : function( query )
	{
		var idValue = "_CheckMediaN" + this.queryList.length;

		var styleQuery = P("head")[0].build( "style", { id : idValue, media : query, text :"#" + idValue + "{left:1px}" } );
		this.queryList.push( styleQuery );									// We want to push the element into an array so whenever the window changes it can update the object info.

		return styleQuery;
	},

	/**
	 * Deletes the node and prevents it from being apart of the checkQueryStates update call.
	 * @param node
	 */
	removeQuery : function( node )
	{
		var i = this.queryList.indexOf( node );
		this.queryList.splice( i, 1 );
	},

	/**
	 * Called automatically on resize to determine what the state of the query's are, but can also be called manually if need be.
	 */
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

/*
//Example test code here showing a possible mobile view check.

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
*/
