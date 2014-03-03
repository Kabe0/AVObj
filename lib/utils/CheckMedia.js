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
		//console.log(this.parent.parent);
		//console.log(this.parent);
		//this.addObserver( stuff, stuff2, stuff3);
		//this.parent.addObserver.apply(this, arguments);
		//this._parent().addObserver(setting, getting, go);
		//console.log(this.parent);
		//this.parent.addObserver(setting, getting, go);
		//console.log("===!==")
		//console.log(testing);
		console.log("hi");
		this.tryThis();
		console.log(this);
		//console.log(this.tryThis());
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
		//console.log(this.parent);

		var prototype = Object.getPrototypeOf(this);
		var prototype2 = Object.getPrototypeOf(prototype);
		var prototype3 = Object.getPrototypeOf(prototype2);

		this.tryThis();
		//console.log(this.tryThis());
		console.log(this);
		//console.log("======");
		//console.log(this.parent);
		//console.log(this.parent.parent);
		//console.log(this.parent.parent.parent);
		//console.log(prototype2);
		//console.log(prototype3);
		//this.testing.testing.addObserver.apply(this, arguments);
		prototype2.addObserver(setting, getting ,go);
		//prototype2.addObserver.call(this, setting, getting, go);
		//console.log(this.parent);
		//console.log(this._parent()._parent());
		//this._parent()._parent().addObserver.apply(this._parent()._parent(), arguments);
		//this.parent.addObserver.apply(this, arguments);
		//this.parent.parent.parent.addObserver(setting, getting, go);
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