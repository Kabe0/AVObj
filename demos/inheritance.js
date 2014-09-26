/**
 * User: Ian
 * Date: 01/03/14
 * Time: 7:15 PM
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * This tutorial is to show how to handle extending AVObjects and inheriting attributes and methods from parent objects.
 * In addition the tutorial will also show road blocks that may occur in relation to the "parent" property.
 */

////////////////////////////////////////
// New Object inheritance using AVObj
///////////////////////////////////////


var Vector3 = AVObj.extend();
Vector3.properties =
{
	init : function(x, y, z)
	{
		this.position = {x:Number(x), y:Number(y), z:Number(z)};
	},

	x :
	{
		get : function()
		{
			return this.position.x;
		}
	},

	y :
	{
		get : function()
		{
			return this.position.y;
		}
	},

	z :
	{
		get : function()
		{
			return this.position.z;
		}
	},

	add : {
		set: function ( newVector )
		{
			this.position.x += Number( newVector.x );
			this.position.y += Number( newVector.y );
			this.position.z += Number( newVector.z );

			return this;
		}
	},

	toString : function()
	{
		return this.position.x + "," + this.position.y + "," + this.position.z;
	}
};

var firstVector = Vector3.create( 55, 22, 36 );
var secondVector = Vector3.create( 222, 100, 684 );

firstVector.add = secondVector;

console.log( firstVector.toString() );


var FirstClass = AVObj.extend();
FirstClass.properties =
{
	init : function()
	{
		this.newValue = "This will be defined for ChildClass instead.";
		console.log("I am the first init."); // This trace will fire first as super() will call this init.
	}
};

var ChildClass = FirstClass.extend();
ChildClass.properties =
{
	init: function()
	{
		this.super();
		console.log("I am the child class");
	}
};

ChildClass.create();	// Construct the class to read the traces.

var TestObject = AVObj.extend();
TestObject.properties =
{
	init: function ()
	{
		console.log( "firstObject" );
	},

	member: function ()
	{
		console.log( "firstMember!" );
	}
};

var FirstOverride = TestObject.extend();
FirstOverride.properties =
{
	init: function ()
	{
		this.super();									// AVObj supports parent init calls by using key word "super".
		console.log( "secondObject" );
	},

	member: function ()
	{
		console.log( "secondMember!" );

		this.callParent("member", 0);					// callParent allows for quick access to the previous object's methods.
	}
};

var SecondOverride = FirstOverride.extend();
SecondOverride.properties =
{
	init: function ()
	{
		this.super();
		console.log( "thirdObject" );
	},

	member: function ()
	{
		console.log( "thirdMember!" );

		this.callParent("member", 0);
	}
};

var testing = SecondOverride.create();						// Create auto calls the init function allowing
															// for object constructors.
testing.member();

/*
////////////////////////////////////////
// Normal object prototype inheritance with the 'Object.create' operator.
////////////////////////////////////////

var TestObject = Object.create(
	{
		init: function ()
		{
			console.log( "firstObject" );							// This TestObject function is lost in the process of prototyping.
			// The only way around this is to manually call another function that
			// acts as it's own init function.
		},
		member: function ()
		{
			console.log( "originalMemeber!" );
			console.log( this );
		}
	} );

var FirstOverride = Object.create( TestObject );

FirstOverride.init = function ()
{
	console.log( "secondObject" );
};
FirstOverride.member = function ()
{
	console.log( "secondMember!" );
	var object = Object.getPrototypeOf( FirstOverride );		// This time we can call the object itself instead of 'this',
	// which fixes scoping issues.
	object.member.apply( this );
};

var SecondOverride = Object.create( FirstOverride );

SecondOverride.init = function ()
{
	console.log( "thirdObject" );
};
SecondOverride.member = function ()
{
	console.log( "thirdMember!" );							// We can provide eventually the same code to call the
	// overrided function as the scope is safe.
	var object = Object.getPrototypeOf( SecondOverride );
	object.member.apply( this );
};

var testing = Object.create( SecondOverride );
testing.init();		// No constructor exists by default with Object.create.
testing.member();
*/

/*
////////////////////////////////////////
// Normal object prototype inheritance with the 'new' operator.
////////////////////////////////////////

var TestObject = function ()
{
	console.log( "firstObject" )						// This TestObject function is lost in the process of prototyping.
														// The only way around this is to manually call another function that
														// acts as it's own init function.
};
TestObject.prototype.member = function ()
{
	console.log( "originalMemeber!" );
	console.log( this );
};

var FirstOverride = function ()
{
	console.log( "secondObject" );
};

FirstOverride.prototype = new TestObject();

FirstOverride.prototype.member = function ()
{
	console.log( "secondMember!" );
	var object = Object.getPrototypeOf( this );			// Can't use FirstOverride as our object starting point as its
														// not yet defined.
	var object2 = Object.getPrototypeOf( object ); 		// "this" is actually the newly constructed object,
														// so we have to go back through two prototype objects.

	console.log( object2 );
	object2.member.apply( this );
};

var SecondOverride = function ()
{
	console.log( "thirdObject" );
};
SecondOverride.prototype = new FirstOverride();

SecondOverride.prototype.member = function ()
{
	console.log( "thirdMember" );
	var object = Object.getPrototypeOf( this );
	var object2 = Object.getPrototypeOf( object );
	var object3 = Object.getPrototypeOf( object2 );		// We constantly have to remember how many objects we
	// have to look back to.

	object3.member.apply( this );
};

var testing = new SecondOverride();
testing.member();
*/
