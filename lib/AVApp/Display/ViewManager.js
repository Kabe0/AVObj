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

namespace( "AVApp.Display", function()
{

	this.ViewManager = AVObj.extend({generateSingleton:true}).prop(
		{
			preInit : function()
			{
				this.views = [];
			},

			init : function(  )
			{
				// Grab all the elemends and then convert them into View's.
				var elements = document.getElementsByTagName( "view" );

				for( var i = 0, length = elements.length; i < length; i++ )
				{
					this.views.push( Node.create( elements[i] ) );
				}
			}
		}
	)

});
