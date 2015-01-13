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
 * Created by Ian on 2014-10-28.
 */

using( AV.Utilities ).within( AV.App.Display, function( $scope )
{
	/**
	 * The base View class can handle loading objects as it has
	 */
	$scope.View = Node.extend().prop(
		{
			preInit : function()
			{
				this.layers = []; // Used to keep track of the layers for the class.
			},

			init : function( element, name )
			{
				this.super( element );

				console.log("testing world");
				if ( this.element.childElementCount > 0 )
				{
					var viewHtml = this.element.innerHTML;

					this.clear();

					this.pushLayer( $scope.Layer.create( $scope.HTMLParser.parseText( viewHtml ) ) );
				}
			},

			/**
			 * Can push in a fade effect when running a layer using LayerTransitionBase objects.
			 *
			 * @param {LayerTransitionBase|Layer} newLayer Either a LayerTransitionBase or Layer object.
			 * @param {Object} viewController
			 */
			pushLayer : function( newLayer, viewController )
			{
				if ( this.currentLayer() != null )
				{
					this.currentLayer().removeSelf();
				}

				this.layers.push( newLayer );

				console.log(newLayer);

				this.push( this.currentLayer() );
			},

			currentLayer : function()
			{
				return this.layers[this.layers.length - 1];
			},

			popLayer : function()
			{

			},

			swapLayer : function()
			{

			}
		}
	)
});