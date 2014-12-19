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
// TODO allow the user to define in template nodes to register to the main layer so that the nodes can get accessed by the controller.
usingNamespace( AV.Utilities, function()
{
	namespace( AV.App.Display, function( $scope )
	{
		$scope.Layer = AVObj.extend().prop(
			{
				init : function(  )
				{
					this.layerNode = node("layer");
				},
				/**
				 *
				 * @param {AV.App.Display.Template} template set of node objects
				 */
				enable : function( viewController, template )
				{
					this.template = template;
					this.viewController = viewController;
					template.addObserver( "nodeEvents", viewController );
				},

				disable : function()
				{
					this.template.removeObserver( "nodeEvents", this.viewController );
				},

				pause : function()
				{

				},

				resume : function()
				{

				}
			}
		)
	});
} );