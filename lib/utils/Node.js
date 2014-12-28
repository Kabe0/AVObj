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

	$scope.Node = AVObj.extend().prop(
		{
			_componentList : {},

			preInit : function()
			{
				this._element = null;
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
				this._element = document.createElement( name );
				this._element._avNode = this;

				if ( !components ) components = [];

				// Loop through all the components defined and if array object, create, and if object add to the _components array.
				for( var i = 0; i < components.length; i++ )
				{
					var component = components[i];

					// We have to make sure that the component exists with a component name, and that the name has been registered with the Node object.
					// If the value is not registered than the component cannot be created.
					if ( component && component._componentName && this._componentList[component._componentName] )
					{
						this.setComponent( component );
					}
					else
					{
						console.error( "Component ", component, " does not exist or is not registered with the Node class. Make sure the MACRO configComponent is defined in the component." );
					}
				}
			},

			//region Child Modifications

			push : function( node )
			{
				this._element.appendChild( node._element );
			},

			remove : function( node )
			{
				this._element.removeChild( node._element );
			},

			children :
			{
				get : function()
				{
					var children = this._element.childNodes;
					var childNodes = [];

					for( var i = 0, length = children.length; i < length; i++ )
					{
						childNodes.push( children );
					}

					return childNodes;
				}
			},

			clear : function()
			{
				var children = this._element.childNodes;
				for( var i = children.length; i--; )
				{
					children[i].pop();
				}
			},

			//endregion

			//region Component Modifications

			getComponent : function( componentName )
			{
				var component = this._componentsMap[ componentName];
				return ( component && component.length > 0 ? this._componentsMap[ componentName ][0] : null );
			},

			getComponents : function( componentName )
			{
				return this._componentsMap[ componentName ];
			},

			setComponent : function( component )
			{
				this._components.push( component );

				// Checking of the componentsMap already has the name registered for the Node, if not the array is created.
				if ( !this._componentsMap[ component._componentName ] ) this._componentsMap[ component._componentName ] = [];

				this._componentsMap[ component._componentName].push( component );
			},

			createComponent : function( componentName, properties )
			{
				var object = this._componentList[componentName];	// Stored so that the scope can be referenced later.
				if ( object )										// We don't want to bother creating the object if it is not registered.
				{
					this._components.push( object.create.apply( object, properties ) );
				}
			}

			//endregion
		}
	);

	var Node = $scope.Node;

	var ComponentTest = $scope.ComponentTest = AVObj.extend(  ).prop(
		{
			init : function()
			{

			}
		});

	var Component = $scope.Component = AVObj.extend( { configComponent : "BaseComponent" } ).prop(
		{
			preInit : function()
			{
				this.storeValue = 0;
			},
			/**
			 *
			 * @param value
			 * @param parentNode the object that this component belongs to.
			 * @constructor AV.App.Utilities.Component
			 */
			init : function( value )
			{
				this.storeValue = value;
				console.log("Base Component Init");
			},

			start : function( parentNode )
			{

			},

			grabValue : function()
			{
				return this.storeValue;
			}
		}
	);

	var node = $scope.Node.create( "div", [ $scope.Component.create("500"), $scope.Component.create("9000") ] );

});