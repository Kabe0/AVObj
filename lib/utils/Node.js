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
 * Created by Ian on 2014-12-19.
 */

using().within( AV.App.Utilities, function( $scope )
{
	$scope.Node = AVObj.extend().prop(
		{
			preInit : function()
			{
				this._components = {};
			},

			/**
			 * @param name
			 * @param [AV.App.Utilities.Component] components
			 * @param nodeAttributes
			 * @constructor AV.App.Utilities.Node
			 */
			init : function( name, components, nodeAttributes )
			{
				// Loop through all the components defined and if array object, create, and if object add to the _components array.
				for( var i = 0; i < components.length; i++ )
				{
					var component = components[i];
					if ( component.isPrototypeOf( $scope.Component ) )
					{
						console.log("hi");
						this.setComponent( component );
					}
					else
					{

					}
				}

			},

			getComponent : function( componentName )
			{

			},

			getComponents : function( componentName )
			{

			},

			setComponent : function( component )
			{
				console.log("setting");
			}
		}
	);

	$scope.Component = AVObj.extend().prop(
		{
			/**
			 *
			 * @param value
			 * @param parentNode the object that this component belongs to.
			 * @constructor AV.App.Utilities.Component
			 */
			init : function( value, parentNode )
			{

			}
		}
	);

	$scope.Node.create( "div", [["Component", $scope.Component.create("500") ], {} ] );

});