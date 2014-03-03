/**
 * User: Ian
 * Date: 02/03/14
 * Time: 7:15 PM
 * Project: AVObj vs 0.01 - Making JS Simple.
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * This js file contains additional functionality for the Element class that are useful when used in conjuntion with
 * AVObj.
 */

/**
 * Allows you to add an observer defined by a scope. (does an addEventListener to an element)
 * @param {String} event
 * @param {String} functionName
 * @param {object} scope
 */
XMLHttpRequest.prototype.addListener = Element.prototype.addListener = function (event, functionName, scope, options)
{
	if(options)
	{
		this['__' + functionName + '_bindValue'] = (scope ? scope[functionName].bind (scope, options) : scope[functionName]);
	}
	else
	{
		this['__' + functionName + '_bindValue'] = (scope ? scope[functionName].bind (scope) : scope[functionName]);
	}
	this.addEventListener (event, this['__' + functionName + '_bindValue'], false);
};
/**
 *
 * @param {String} event
 * @param {String} functionName
 */
XMLHttpRequest.prototype.removeListener = Element.prototype.removeListener = function (event, functionName)
{
	this.removeEventListener (event, this['__' + functionName + '_bindValue'], false);
	delete this['__' + functionName + '_bindValue']
};

/**
 * Creates a new Element and appends it to the parent element.
 * @param {String} e The name of the new element to append.
 * @param {Object} o The parameters for that element.
 * @return {*} Returns the new element into a variable if defined.
 * @see element
 */
Element.prototype.element = function (e, o, name)
{
	var n = AVObj.element (e, o);
	if (o)
	{
		if (o.before)
			this.insertBefore (n, o.before);
		else if(o.after)
		{
			if(o.after.nextSibling) this.insertBefore(n, o.after.nextSibling);
			else this.appendChild(n);
		}
		else
			this.appendChild (n);
	}
	else
		this.appendChild (n);
	if(name)
		this[name] = n;
	return n;
};

Element.prototype.appendComponent = function(component)
{
	this.appendChild(component.content);
	return component;
};
/**
 * change element properties
 * @param {Object} o
 */
Element.prototype.properties = function(o)
{
	for (var i in o)
	{ //noinspection JSUnfilteredForInLoop
		this[i] = o[i];
	}
};

Element.prototype.hide = function ()
{
	if (!this._storeDisplayStyle)
		this._storeDisplayStyle = this.style.display;
	this.style.display = "none";
};

Element.prototype.show = function ()
{
	this._storeDisplayStyle = null;
	this.style.display = (this._storeDisplayStyle ? this._storeDisplayStyle : "");
};

/**
 * Removes the element called.
 */
Element.prototype.remove = function ()
{
	if(this.parentNode)
		this.parentNode.removeChild (this);
};
/**
 * Gets rid of the white space before and after a string.
 * @return {*} A new string with no trailing whitespace.
 */
Element.prototype.trim = function ()
{
	return this.replace (/^\s\s*/, '').replace (/\s\s*$/, '');
};
/**
 * condensed Method for inserting text into an element
 * @param {String} v The text you want to add to the element.
 */
Element.prototype.addText = function (v)
{
	//this.innerText = v;
	this.appendChild (document.createTextNode (v));
};
/**
 * condensed Method for inserting text into an element but replaces existing text before inserting.
 * @param {String} v The text you want to add to the element.
 */
Element.prototype.changeText = function (v)
{
	this.clearNodes ();
	this.appendChild (document.createTextNode (v));
};
/**
 * Used to clear nodes inside a given element.
 */
Element.prototype.clearNodes = function ()
{
	for (var i = this.childNodes.length; i--;)
		this.removeChild (this.firstChild);
};

/**
 * Checks if the element is in the document tag (exists.
 * @returns {boolean}
 */
Element.prototype.inDocument = function ()
{
	var element = this;

	while (element = element.parentNode) if (element === document) return true;

	return false;
};