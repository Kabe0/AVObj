AVObject - The easier way to program in JS
=====

AVObject is a utility for JS projects. This utility is designed to simplify the process of creating prototype objects, reducing the frustration and complexity of building objects with the newer ECMAScript 5 standards.

##Features of AVObject

*   Based on the Object.create() method for cleaner prototyping
*   Support for extending and creating objects with ease.
*   Simple syntax for creating getter/setter properties
*   Support for the singleton pattern
*   Parent property access for objects that are extended (prototype access).
*   User-friendly Observer pattern with built in scoping (Can be attached to basic objects using AVObj.attachObserverModel() method).

> This code is at a very early state of development and is still being improved apon!

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
    testVar : "Awesome!", // One of the many ways to define variables in an object.
    
    init : function ()  // Optional constructor method!
    {
        this.myMethod();
    },
    
    deInit : function (){}, // Optional DeConstructor method!
    
    myMethod : function ()  // Test function that will let us know the object is constructed!
    {
        alert("Constructor called this " + testVar + " method!");
    }
};
```
We have built ourselves a complete object, but if you run it you will notice nothing happens. This is because the object has been defined but we have not created any instances of it. To create an instance of the object call we have to add this code below...

```javascript
var newInstance = NewObject.create();
```
You should see the alert we created in myMethod fire letting you know that the object has been constructed.



