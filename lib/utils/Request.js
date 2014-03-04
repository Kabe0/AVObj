/**
 * Created by iancarson on 3/3/2014.
 * Project: AVObj vs 0.01 - Making JS Simple.
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * Used to load other files by either POST or GET.
 */
"use strict";

var Request = AVObj.extend();
Request.properties =
{
	/**
	 * Call Request Init to create a request for a specific page.
	 * @param method The way the data should be sent. (Either Post or Get).
	 * @param url The path to the file you want to load.
	 * @param asynchronous If the event should halt all other processes.
	 * @param finishFunction The function that will fire once the call is completed.
	 * @param data Additional info such as form data goes here.
	 */
	init : function (method, url, asynchronous, finishFunction, data)
	{
		this.request = new XMLHttpRequest ();
		this.method = method;
		this.url = url;
		this.asynchronous = asynchronous;
		this.finishFunction = finishFunction;
		this.data = data;
		if (this.request == null)
		{
			console.error ("Browser does not support XMLHTTPRequest.");
		}
		else if (typeof url === 'string')
		{
			this.request.addListener ("error", 'transferError', this);
			if (method === "POST")
			{
				this.sendPostRequest ();
			}
			else if (method === "GET")
			{
				this.sendGetRequest ();
			}
			else
			{
				console.error ("no method defined. Please set to \"POST\" or \"GET\".");
			}
		}
		else
		{
			console.error ("URL is not defined or is not a string.");
		}
	},

	transferError : function()
	{
		console.error ("An error has occurred while transferring the data.");
	},

	sendGetRequest : function()
	{
		this.request.open (this.method, this.url + "?" + this.convertToString (), this.asynchronous);
		if (!this.asynchronous)
		{
			this.request.send (null);
			this.finishFunction ({responseText : this.request.responseText});
		}
		else
		{

			this.request.addListener ("load", 'fireFunction', this);
			this.request.send (null);
		}
	},

	sendPostRequest : function()
	{
		this.request.open (this.method, this.url, this.asynchronous);
		if (!this.asynchronous)
		{
			this.request.send (this.convertToForm ());
			this.finishFunction ({responseText : this.request.responseText});
		}
		else
		{
			this.request.addListener ("load", 'fireFunction', this);
			this.request.send (this.convertToForm ());
		}
	},

	fireFunction : function()
	{
		this.request.removeListener ("error", 'transferError');
		this.request.removeListener ("load", 'fireFunction');
		this.finishFunction (e.currentTarget);
	},

	kill : function()
	{
		this.request.removeListener ("error", 'transferError');
		this.request.removeListener ("load", 'fireFunction');
		this.request.abort ();
	},

	/**
	 * Converts the data to a string format.
	 * @returns {string}
	 */
	convertToString : function ()
	{
		var newString = "";
		if (typeof this.data == "object")
		{
			var firstAnd = false;
			for (var element in this.data)
			{
				if (firstAnd)
				{
					//noinspection JSUnfilteredForInLoop
					newString += "&" + element + "=" + encodeURIComponent (this.data[element]);
				}
				else
				{
					firstAnd = true;
					//noinspection JSUnfilteredForInLoop
					newString += element + "=" + encodeURIComponent (this.data[element]);
				}
			}
		}
		else if (typeof this.data == 'string') newString = this.data;

		return newString;
	},

	/**
	 * Converts the data to a FormData format.
	 * @returns {*}
	 */
	convertToForm : function()
	{
		var object;
		if (typeof this.data == "object" && typeof FormData != 'undefined')
		{
			if (this.data instanceof FormData === false)
			{
				object = new FormData ();
				for (var element in this.data)
				{ //noinspection JSUnfilteredForInLoop
					object.append (element, this.data[element]);
				}
			}
			else
			{
				object = this.data;
			}
		}
		else object = this.convertToString();

		if (typeof object == 'string')
			this.request.setRequestHeader ("Content-type", "application/x-www-form-urlencoded");

		return object;
	}
};