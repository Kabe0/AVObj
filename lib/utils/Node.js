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

using().within( AV.Utilities, function( $scope )
{
	AVObjMacro( "configComponent",
		function ( properties, name ) {
			properties._componentName =
			{
				value : name
			}
		},
		function( object, name )
		{
			$scope.Node._componentList[name] = object;
		}
	);

	var Node = $scope.Node = AVObj.extend().prop(
		{
			_componentList : {},

			preInit : function()
			{
				this._components = [];
				this._componentsMap = {};
			},

			/**
			 * @param {string} name
			 * @param {AV.Utilities.Component[]} components
			 * @param {object} nodeAttributes
			 * @constructor AV.App.Utilities.Node
			 */
			init : function( name, components, nodeAttributes )
			{
				if ( !components ) components = [];

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

					this.setComponent( component );
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
				this._components.push( component );
				if ( !this._componentsMap[ component._componentName ] ) this._componentsMap[ component._componentName ] = [];
				this._componentsMap[ component._componentName].push( component );
			}
		}
	);

	var Component = $scope.Component = AVObj.extend( { configComponent : "BaseComponent" } ).prop(
		{
			/**
			 *
			 * @param value
			 * @param parentNode the object that this component belongs to.
			 * @constructor AV.App.Utilities.Component
			 */
			init : function( value )
			{
				console.log("Base Component Init");
			},

			start : function( parentNode )
			{

			}
		}
	);

	$scope.Node.create( "div", [ $scope.Component.create("500") ] );

});