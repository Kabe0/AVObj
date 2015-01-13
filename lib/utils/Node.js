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
			_componentList: {},

			preInit: function ()
			{
				this._element = null;
				this._components = [];
				this._componentsMap = {};
			},

			/**
			 * @param {string|element} name Pass in either a string value or element if you want to wrap the node around it.
			 * @param {AV.Utilities.Component[]} components
			 * @param {object} nodeAttributes
			 * @constructor AV.App.Utilities.Node
			 */
			init: function ( name, components, nodeAttributes )
			{
				this._element = ( typeof name == "object" ? name : document.createElement( name ) );
				this._element._avNode = this;

				if ( !components ) components = [];

				// Pushing in some default mandatory components.
				components.push( $scope.Attributes.create() );

				// Loop through all the components defined and if array object, create, and if object add to the _components array.
				for ( var i = 0; i < components.length; i++ )
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

			element :
			{
				get : function()
				{
					return this._element;
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

			removeSelf : function()
			{
				this._element.parentElement.removeChild( this._element );
			},

			children :
			{
				get : function()
				{
					var children = this._element.childNodes;
					var childNodes = [];

					for( var i = 0, length = children.length; i < length; i++ )
					{
						if ( childNodes[i]._avNode )
						{
							childNodes.push( childNodes[i]._avNode );
						}
						else
						{
							childNodes.push( $scope.Node.create( childNodes[i] ) );
						}
					}

					return childNodes;
				}
			},

			clear : function()
			{
				var children = this._element.childNodes;

				this._element.innerHTML = "";
				for( var i = children.length; i--; )
				{
					this._element.removeChild( children[i] );
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

				component.setParent( this );
				component.start( this );
			},

			createComponent : function( componentName, properties )
			{
				var object = this._componentList[componentName];	// Stored so that the scope can be referenced later.
				if ( object )										// We don't want to bother creating the object if it is not registered.
				{
					var newObject = object.create.apply( object, properties );

					this._components.push( newObject );
					newObject.setParent( this );
					newObject.start( this );
				}
			}

			//endregion
		}
	);

	$scope.Component = AVObj.extend( { configComponent : "BaseComponent" } ).prop(
		{
			preInit : function()
			{
				this.node = null;
			},

			setParent : function( parentNode )
			{
				this.node = parentNode;
			},

			start : function( )
			{
			}
		}
	);

	$scope.Attributes = $scope.Component.extend(( { configComponent : "Attributes" }) ).prop(
		{
			preInit : function()
			{
			},

			start : function()
			{
			},

			attribute : function( name, newValue )
			{
				if ( newValue )
				{
					return this.node.element.setAttribute( name, newValue )
				}
				else
				{
					return this.node.element.getAttribute( name );
				}
			},

			removeAttribute : function( name )
			{
				//this.nodeAttributes.removeNamedItem( name );
			}
		}
	);

	//var node = $scope.Node.create( "div", [ $scope.Component.create("500"), $scope.Component.create("9000") ] );

});