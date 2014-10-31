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
	/**
	 * This class is read by the View and will be used to transition the layer into the next stage.
	 * This uses a state system to handle the transition proccess.
	 */
	this.LayerTransitionBase = AVObj.extend().prop(
		{
			transitionEnum : { BEING : 0, RUNNING : 1, ENDED :2 },

			init : function()
			{
				this.currentState = this.transitionEnum.BEING;
			}
		}
	)

});