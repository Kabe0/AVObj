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
		},
		function( option, constructorArguments )
		{
			this.super( option.name, constructorArguments[1] );
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
		 * @param {AV.App.Utilities.Node} layer If defined, will automatically append to object.
		 */
		buildLayer : function( nodeTree, layer )
		{
			var layerNodes 		= {};	// Stores the constructed objects as defined by the nodeTree./*

			var regExp1 = /cm-([^\s]*)/;

			console.log( nodeTree, this.regList );
			var constructArray = function( children, parent )
			{
				for( var i = 0, length = children.length; i < length; i++ )
				{
					var child = children[i];

					switch( child.type )
					{
						case $scope.Parser.ELEMENT:

							// Grab all the component values
							var attributes = {}, components = [];

							for( var j = 0, jLength = child.attributes.length; j < jLength; j++ )
							{
								for( var attributeName in child.attributes[j] )
								{
									if ( result = attributeName.match( regExp1 ) )
									{
										components.push( Node._componentList[result[1]].create( child.attributes[j][attributeName] ) );
									}
									else
									{
										attributes[attributeName] = child.attributes[j][attributeName];
									}
								}
							}

							if ( this.regList[child.name] )
							{
								console.log( "Construct Special", child.name );
								parent.push( this.regList[child.name].component.create( parent, components ) )

							}
							else
							{
								console.log("construct general node");
								var newNode = Node.create( child.name, components, attributes );
								parent.push( newNode );

								// If child nodes, increment through them.
								if ( child.children )
								{
									constructArray( child.children, newNode );
								}
							}

							break;
						case $scope.Parser.TEXT:

							var newText = document.createTextNode( child.text );

							parent._element.appendChild( newText );

							break;
						default:
						case $scope.Parser.UNKNOWN:
							break;
					}
				}
			}.bind(this);

			var objects = constructArray( nodeTree, layer );

			return layer;
		}
	});

	// Testing component that can be applied to the Assembler.
	$scope.NewEntity = Node.extend( { registerEntity: { name:"k", attributes:["firstName", "lastName"] } } ).prop(
		{
			init : function( parent, components, firstName, lastName )
			{

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