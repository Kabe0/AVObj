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
 * Created by Ian on 2014-12-15.
 */

using( AV.Utilities ).within( AV.App.Display, function( $scope )
{

	AVObjMacro( "registerEntity",
		null,
		function( object, options )
		{
			$scope.Assembler.registerAssemblerEntity( object );
		}
	);


	/**
	 * The Assembler class handling building view's and assigning properties and events to the views.
	 * @class AV.App.Utilities.Assembler
	 */
	$scope.Assembler = AVObj.extend( { initStaticObject : true } ).prop(
	{
		regList : {},		// Stores all the assembler components based on name.
		registerAssemblerEntity : function ( component )
		{
			console.log("registered");
		},
		buildLayer : function( layer, buildTree )
		{

		}
	});

	$scope.BaseEntity = AVObj.extend().prop(
		{
			init : function()
			{

			}

		}
	);

	// Testing component that can be applied to the Assembler.
	$scope.NewEntity = Node.extend( { registerEntity: { name:"k", attributes:["firstName", "lastName"] } } ).prop(
		{
			init : function( node, firstName, lastName )
			{
				console.log("called");
			}
		}
	);
});

/*
usingNamespace( function()
{
	namespace( AV.App.Display, function( $scope )
	{
		$scope.Assembler = AVObj.extend( { initStaticObject : true } ).prop(
		{
			init : function()
			{

			}
		});
	});
});*/