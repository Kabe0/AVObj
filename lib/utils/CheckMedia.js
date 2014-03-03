/**
 * Created by iancarson on 3/2/2014.
 */
"use strict";

var CheckMedia = AVObj.extend();
CheckMedia.properties =
{
	head : null,

	queryList : [],

	events : {
		ON_TRUE:"onTrue",
		ON_FALSE:"onFalse"
	},

	init : function()
	{
		this.head = document.getElementsByTagName("head")[0];

		// We have to scope it to the object to retain instance objects.
		window.addEventListener("resize", this.checkQueryStates.bind(this));
	},

	/**
	 * Creates a new query object and returns the node with the ObserverModel attached to it.
	 * @param query
	 */
	registerQuery : function( query )
	{
		var idValue = "_CheckMediaN" + this.queryList.length;
		var styleQuery = this.head.element("style", { id : idValue, media : query, text : "#" + idValue + "{left:1px;}" });

		AVObj.attachObserverModel(styleQuery);

		this.queryList.push(styleQuery);
		return styleQuery;
	},

	/**
	 * /**
	 * Overriding the default addObserver and adding additional info.
	 * @param listenScope
	 * @param functionName
	 * @param scope
	 */
	//registerObserver : function( observer)
	addObserver : function(listenScope, functionName, scope)
	{
		CheckMedia.parent.addObserver.apply(this, arguments);
		if ( listenScope == this.events.ON_TRUE )
		{
			//if ( styleQuery.getAppliedStyle().left == "1px" ) {
			//	this.testFire();
			//}
		}
	},

	/**
	 * Called automatically on resize to determine what the state of the query's are, but can also be called manually if need be.
	 */
	checkQueryStates : function()
	{
		this.queryList.forEach( function(a)
		{
			if (a.getAppliedStyle().left == "1px" )
			{
				if ( !a.wasTrue )
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

/* Example test code here...

function pageLoaded()
{
	var testNode = CheckMedia.instance().registerQuery("only screen and (max-width : 767px)");

	testNode.addObserver(CheckMedia.events.ON_TRUE, "mobileView", this);
	testNode.addObserver(CheckMedia.events.ON_FALSE, "leaveMobileView", this);
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