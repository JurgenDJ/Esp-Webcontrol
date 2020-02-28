# Esp-Webcontrol
Base stack for developing an application to run on Espressif ESP 8266, serving an interactive webpage for showing information and performing actions.

Attractive html based user interfaces provide adaptive behaviour, and client side interactivity (single page, ajax, ... no page refreshes)

Developing such web interfaces has become easier with modern CSS features such as CSS Grid, and the Fetch Web API.
Still, developing applications for the arduino/esp8266 platform is done in c++, which is not fitted for developping and debugging web code. 
Another drawback is the high use of limited resources: 
- Memory usage, for dealing with html strings
- Concurrent network connections, when serving multiple html/javascript/css fragments. 

## Composition of the application
1. The webpage is developed in a typical environment, using HRML, SASS/CSS, and javascript files. This enables the use of linting, intellisense, typescript and SASS transpiling, ....
2. The hosting page is minified, inlined and gzipped, to one single condensed webrequest.
3. All interaction with the hardware, retrieving sensorvalues, setting switches, ... is done in short json based get/post requests.

## Structure of the sourcefiles

(...) still to describe

## getting started
### IDE and tooling
- As a base, I am using **Visual Studio Code** together with the **PlatformIO** extension.
- for compiling SASS, I'm using the **Live Sass Compiler** extension (*ritwickdey.live-sass*)

### setting up the project
1. Either start from a clone of this repository, or copy the webcontent folder in an existing platformIO project folder
2. run ```npm install``` from within the webcontent folder. this will create the node_modules subfolder and fetch all the required tools for building and testing.

(...) to complete : loading the npm modules, which addons to use in vscode to make use of the gulp automation

## Running / Testing the application

(...)- still to describe

Various runmodes on the client side
a. final 
b. inlined html
c. base html

x. json requests handled by the arduino c++ code
y. json requests mocked in the testenvironment

## Credits

This project is greatly inspired by the information I found on a tutorial by Xose Pérez on his Tinkerman blog:
 https://tinkerman.cat/post/embed-your-website-in-your-esp8266-firmware-image/
I have used several snippets from the example code Xose posted. 
