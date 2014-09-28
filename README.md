AVObject - Designed with scalability in mind.
=====

AVObject is a utility for JavaScript projects. This utility is designed to simplify the process of creating prototype objects, reducing the frustration and complexity of building objects with the newer ECMAScript 5 standards. The utility follows a syntax that partually resembles the Class structure of other languages while maintaining additional functionality related to JavaScript.

##News and Updates
Added new functionality to the Node class such as smart recursing deletion as well as provded better tools for accessing parent methods. Check out the changelog for more info.

##Features of AVObject

*   Based on the Object.create() method for cleaner prototyping
*   Class strutured object building, allowing the ablity to extend other objects.
*   Support for extending and creating objects with ease. [Wiki Info](https://github.com/Kabe0/AVObj/wiki/2.-Inheritance-Problem)
*   Simple syntax for creating getter/setter properties
*   Support for the singleton pattern
*   Smart Node manipulation for fast development with greatly enhanced functionality.
*   Parent property access for objects that are extended (prototype access).
*   Avoid Javascript downfalls with prototype's and never ending loops when accesing parent methods.
*   User-friendly Observer pattern with built in scoping (Can be attached to basic objects using AVObj.attachObserverModel() method).

## Quick Start Guide

AVObj.js is the only required file for the advanced object to work. AVObjects can be attached to either existing plane objects or created from the base AVObj object. Lets start by creating a new object off of AVObject.

```javascript
var NewObject = AVObj.extend();
```

The command we just wrote uses Object.create() to build us a new object with a prototype connection of all the methods and properties of the object AVObj. It has also provided us with some prebuilt functionality such as a **parent** to access the previous properties and methods (prototype), **super** to call a method's parent method, and **_observers** to append listeners to our object. 

Next lets add some of our own methods and properties to the new object we just created. The first two methods ever created are init and deInit. These will fire when the object is either created or destroyed.

```javascript
var NewObject = AVObj.extend();
NewObject.properties = 
{
    sharedVariable : "Shared between all classes!",     // Defining properties outside of methods will result in that
                                                        // property being shared between all objects created by the class.
    
    init : function ()  // Optional constructor method!
    {
        this.testVar = "Awesome!"; // One of the many ways to define variables in an object.
        
        this.myMethod();
    },
    
    deInit : function (){}, // Optional DeConstructor method!
    
    myMethod : function ()  // Test function that will let us know the object is constructed!
    {
        alert("Constructor called this " + this.testVar + " method!");
    }
};
```
We have built ourselves a complete object, but if you run it you will notice nothing happens. This is because the object has been defined but we have not created any instances of it. To create an instance of the object call we have to add this code below...

```javascript
var newInstance = NewObject.create();
```
You should see the alert we created in myMethod fire letting you know that the object has been constructed.

##Contributing##
Please don't hesitate to let me know of any issues you have, all issues will be looked at and *hopefully* fixed as soon as I see them!

If you have any new ideas and want to contribute to the projet let me know. The point of this utility was to grow and I am more than willing and happy to see the codebase expanded on!

##License##
Copyright (c) 2013-2014 Ian Carson <icarson2@live.ca> - linkedIn <http://lnkd.in/9qJWap>

You are free to use any AVObj project in any other project (even commercial projects) as long as the copyright header is left intact.
[MIT License](http://www.opensource.org/licenses/mit-license.php)

