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


 // New Object inheritance using AVObj

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
		console.log( this );
	}
};

var FirstOverride = TestObject.extend();
FirstOverride.properties =
{
	init: function ()
	{
		FirstOverride.super();								// AVObj supports parent init calls by using key word "super".
		console.log( "secondObject" );
	},

	member: function ()
	{
		console.log( "secondMember!" );
		FirstOverride.parent.member.apply( this );			// Parent allows for quick access to the previous object
															// scope and can be stacked while maintaining readability.
	}
};

var SecondOverride = FirstOverride.extend();
SecondOverride.properties =
{
	init: function ()
	{
		SecondOverride.super();
		console.log( "thirdObject" );
	},

	member: function ()
	{
		console.log( "thirdMember!" );
		SecondOverride.parent.member.apply( this );
	}
};

var testing = SecondOverride.create();						// Create auto calls the init function allowing
															// for object constructors.
testing.member();


/*
 // Normal object prototype inheritance with the 'Object.create' operator.

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
// Normal object prototype inheritance with the 'new' operator.

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
