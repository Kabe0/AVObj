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

namespace( AV.App.Display, function( $scope )
{
	this.Component = AVObj.extend().prop(
		{
			init : function(  )
			{
				this.regExp = /<(?!\\)([\w]*)([\S\s]*)\/?\>$/
			},
			build : function()
			{

			}
		}
	);

	$scope.Parser = AVObj.extend().prop(
		{
			// eNUMs
			UNKNOWN : 0,
			TEXT 	: 1,
			ELEMENT : 2,

			init : function()
			{
				console.log("hi");
			}
		}
	);

	//TODO clean up parser.
	$scope.HTMLParser = $scope.Parser.extend( { initStaticObject : true } ).prop(
		{
			parseText : function( text )
			{
				// Build tree objects defined with {{ nodeData, children }}
				var buildTree = [];
				var currentChildren = [ buildTree ];

				// Split up text into individual nodes ranging from Elements to textNodes
				var regExp = /<([a-zA-Z\d= '"-]+)>|<\/([a-zA-Z\d= '"-]+)>|([\w\s{{}}]+)/mg;
				var regExp2 = /(?:([\w\s]+)=?["']?([\w\s]*)["']?)/mg;

				var result;

				while ( result = regExp.exec(text))
				{
					// Open Node1
					if ( result[1] )
					{
						var nodeResult = result[1].trim().match(/^(\w*)/);

						var slice = result[1].slice(nodeResult[1].length);
						var result2;
						var attributes = [];

						while( result2 = regExp2.exec(slice) )
						{
							var newObj = {};
							newObj[result2[1]] = result2[2];

							attributes.push( newObj );
						}

						var newChildren = [];
						var newObject = { type : this.ELEMENT, name : nodeResult[1], attributes : attributes, children : newChildren };
						currentChildren[currentChildren.length - 1].push( newObject );
						currentChildren.push( newChildren );	// Construct a new list of children.
					}
					else if ( result[2] )
					{
						if ( currentChildren.length > 1 ) currentChildren.pop();
					}
					else if ( result[3] )
					{
						currentChildren[currentChildren.length - 1].push( { type : this.TEXT, text : result[3] } );
					}
				}

				return buildTree;
			},
			serialize : function()
			{

			}
		}
	);


	/**
	 * Templates are constructed by the Parsers and handle the interactions of an app.
	 */
	this.Template = AVObj.extend().prop(
		{
			/**
			 * @extends AVObj
			 * @class AV.App.Display.Template
			 */
			init : function()
			{

			}
		}
	);

/*
	var LanguageParser =
	{
		stringParser : /<([a-zA-Z\d= '"-]+)>|<\/([a-zA-Z\d= '"-]+)>|{{([\w\s]+)}}|([\w +="']+)/gm,
		results :
		{
			1 : {
				exp : "<([a-zA-Z\d= '\"-]*)>",
				name: "element",
				exec: function ( instance, instructions )
				{
					var stringer = /<([a-zA-Z\d= '"-]+)>|<\/([a-zA-Z\d= '"-]+)>|{{([\w\s]+)}}|([\w +="']+)/gm;
					var execut;
					console.log("hi");
					if ( execut = stringer.exec( instructions ) )
					{
						console.log( execut );
					}

					//var results = instance.grabCheese2( instructions );

					/*
					var arguments = {}

					var match;

					while( match = /[a-zA-Z\d=]/g.exec( instructions ) )
					{

					}

					return {

					};

				}
				},
			2 : {
				exp : "<\/([a-zA-Z\d= '\"-]*)>",
				name: "closeElement",
				exec: function ( name, instructions )
				{

				}
			},
			3 : {
				exp : "{{([\w\s]*)}}",
				name: "operation",
				exec: function ( name, instructions )
				{

				}
			},
			4 : {
				exp : "([\w ]+)",
				name: "textNode",
				exec: function ( name, instructions )
				{
				}
			}
		}
	};*/



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
				this.watchValues = {};

				this.assembler = [];

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
			//	this.grabCheese3( instructions );
			},

			createAssembler : function( type, instruction )
			{
				this.assembler.push( { type:type, instruction:instruction } );
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
		//		var superString = "pringles";
			//	console.log( superString >> 5);

				/*
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
				*/
			},

			grabCheese2 : function( string )
			{
				console.time("cheese 2" );

				var assembler = [];
				var results;
				var length = LanguageParser.results.length;

			//	console.log(string);

				while( results = LanguageParser.stringParser.exec(string) )
				{
					for( var i = 1, resultLength = results.length; i < resultLength; i++ )
					{
						if ( results[i] != null )
						{
							//assembler.push( { name: LanguageParser.results[i].name, instructions: results[i] } );

							if ( LanguageParser.results[i].exec(this, results[i] ) )
							{

							}

							break;
						}
					}
					//resultArray.push(result);
				}

				//console.log(assembler);

				console.timeEnd("cheese 2");

				return assembler;
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