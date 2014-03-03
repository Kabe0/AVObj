/**
 * Created by iancarson on 3/2/2014.
 */

var CheckMedia = AVObj.extend();
CheckMedia.properties =
{
	head : null,
	body : null,

	events : {
		ON_TRUE:"onTrue",
		ON_FALSE:"onFalse"
	},

	queryList : [],

	init : function()
	{
		this.head = document.getElementsByTagName("head")[0];
		this.body = document.getElementsByTagName("body")[0];
	},

	/**
	 *
	 * @param query
	 */
	registerQuery : function( query )
	{
		var idValue = "_CheckMediaN" + this.queryList.length;
		var styleQuery = this.head.element("style", { id : idValue, media : query, text : "#" + idValue + "{left:1px;}" });
		//var styleTest = this.body.element("div", { id : idValue });

		if ( styleQuery.getAppliedStyle().left == "1px") {
			console.log("stuff" + styleQuery.getAppliedStyle().left);
		}
		this.queryList.push(styleQuery);
	},

	addObserver : function(setting, getting, go)
	{
		CheckMedia.parent.addObserver.apply(this, arguments);
	},

	testFire : function()
	{
		this.fireObservers(this.events.ON_TRUE);
	}
};

var testing = CheckMedia.extend();
testing.properties =
{
	addObserver : function(setting, getting, go)
	{
		testing.parent.addObserver.apply(this, arguments);
	}
};

function loadingStuff()
{
	testing.instance();
	testing.instance().registerQuery("only screen and (max-width : 767px)");
	testing.instance().registerQuery("only screen");

	testing.instance().addObserver(CheckMedia.events.ON_TRUE, "superFunction", this);
	testing.instance().testFire();
	//console.log(CheckMedia.instance());
}

function superFunction()
{
	console.log("hi all");
}

window.addEventListener("load", loadingStuff);