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
	var LanguageObject =
	{
		builder :[
			{
				reg:  /<(?!\\)([\w]*)([\S\s]*)\/?\>$/,
				exec: function ( checkValue )
				{
					//var results;
					//if ( results = checkValue.match( /^<([\w]*)([\S\s]*)\/?\>$/ ) )
					//{
					//	var buildObject = results[1];
						//var properties = results[2];

						console.log( checkValue );

					//	AV.Utilities.node( buildObject )
					//}

					// Returning true eats the value, returning false will allow the next function to test.
					return true;
				}
			}
		],
		stringParser : /(<[a-zA-Z\d ="-\/]*>|[\w]+)/gm
	};

	/**
	 * The Interpreter handles converting any string text into dynamic node
	 * data that can be used by a Layer then rendered into the view.
	 */
	this.Interpreter = AVObj.extend().prop(
		{
			/**
			 *
			 * @param {String} instructions
			 */
			init : function( instructions, language )
			{
				var node1 = AV.Utilities.node("div");
				var node2 = AV.Utilities.node("div");

/*
				console.time("innerHTML test");

				node1.innerHTML = instructions;*
				console.timeEnd("innerHTML test");

				console.time("test1" );

				var resultArray = instructions.match( LanguageObject.regParser );
				console.timeEnd("test1");

				console.time("test2" );
				var results;

				while( results = LanguageObject.regParser.exec(instructions) )
				{
					var result = results[1];

					//resultArray.push(result);
				}

				console.timeEnd("test2");

//				console.log(resultArray, res);
*/
				this.grabCheese1( instructions );
				this.grabCheese2( instructions );
				this.grabCheese3( instructions );
			},

			/**
			 * Handles the construction of the Interpreter code.
			 * @param controllers
			 * @param model
			 * @return AV.Utilities.Node
			 */
			buildTemplate : function( controllers, model )
			{

			},

			/**
			 * Returns the processed information so that the layer can render it.
			 * (called by the base Layer class).
			 */
			getLayerInstruct : function()
			{

			},

			grabCheese1 : function( string )
			{
				console.time("cheese 1" );

				var stringCheck = "hellp";


				var stringPointer = 0;
				var pointer = 0;

				while( pointer != string.length )
				{
					// We AUTO increment this every time it's called as the string must move forward.
					// A letter matches, move forward
					if ( stringCheck[stringPointer] == string[pointer] )
					{
						stringPointer++;
						if ( stringCheck.length - 1 == stringPointer )
						{
							//console.log("success ", stringPointer, pointer );
							break;
						}
					}
					// No match reset the array
					else
					{
						stringPointer = 0;
					}
					pointer++
				}

				console.timeEnd("cheese 1");
			},

			grabCheese2 : function( string )
			{
				console.time("cheese 2" );

				var results;
				var length = LanguageObject.builder.length;

				while( results = LanguageObject.stringParser.exec(string) )
				{
					for( var i = length; i--; )
					{
						var buildResult;
						if ( buildResult = results[1].match( LanguageObject.builder[i].reg ) )
						{
							LanguageObject.builder[i].exec( buildResult );
							break;
						}
						// fire with the result that we got from the string.
						//LanguageObject.builder[i]( results[1] );
					}
					//resultArray.push(result);
				}

				console.timeEnd("cheese 2");
			},

			grabCheese3 : function( string )
			{
				console.time("cheese 3" );
				var resultArray = string.match( LanguageObject.regParser );

				for( var i = 0, length = resultArray.length; i < length; i++ )
				{
					if ( resultArray[i] == "hellp" )
					{
						//console.log("success");
						break;
					}
				}

				console.timeEnd("cheese 3");
			}
		}
	)
});