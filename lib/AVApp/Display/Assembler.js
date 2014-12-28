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
		function( object, option )
		{
			$scope.Assembler.registerAssemblerEntity( object, option.name, option.attributes );
		}
	);


	/**
	 * The Assembler class handling building view's and assigning properties and events to the views.
	 * @class AV.App.Utilities.Assembler
	 */
	$scope.Assembler = AVObj.extend( { initStaticObject : true } ).prop(
	{
		regList : {},		// Stores all the assembler components based on name.
		registerAssemblerEntity : function ( component, name, attributes )
		{
			this.regList[name] = { component : component, attributes : attributes };
			console.log("registered");
		},
		/**
		 * Generates the elements based on the nodeTree instructions.
		 * @param nodeTree
		 * @param {[AV.App.Utilities.Node]} layer If defined, will automatically append to object.
		 */
		buildLayer : function( nodeTree )
		{
			var layerNodes 		= {};	// Stores the constructed objects as defined by the nodeTree.
			var layerNode 	= Node.create( "layer" );

			console.log( nodeTree, this.regList );
			var constructArray = function( children, parent )
			{
				for( var i = 0, length = children.length; i < length; i++ )
				{
					var child = children[i];

					switch( child.type )
					{
						case $scope.Parser.ELEMENT:

							if ( this.regList[child.name] )
							{
								console.log( "Construct Special" );
							}
							else
							{
								parent.push( Node.create( child.name ) );
								//currentParent Node.create( child.name )
							}
							console.log("construct special");

							break;
						case $scope.Parser.TEXT:
							break;
						default:
						case $scope.Parser.UNKNOWN:
							break;
					}
				}
			}.bind(this);

			var objects = constructArray( nodeTree, layerNode );

			return layerNode;
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