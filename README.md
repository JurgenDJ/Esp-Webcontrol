# Esp-Webcontrol
Base stack for developing an application to run on Espressif ESP 8266, serving an interactive webpage for showing information and performing actions.

Attractive html based user interfaces provide adaptive behaviour, and client side interactivity (single page, ajax, ... no page refreshes)

Developing such web interfaces has become easier with modern CSS features such as CSS Grid, and the Fetch Web API.
Still, developing applications for the arduino/esp8266 platform is done in c++, which is not fitted for developping and debugging web code. 
Another drawback is the high use of limited resources: 
- Memory usage, for dealing with html strings
- Concurrent network connections, when serving multiple html/javascript/css fragments. 

## Composition of the application
1. The webpage is developed in a typical environment, using HTML, SASS/CSS, and javascript files. This enables the use of linting, intellisense, typescript and SASS transpiling, ....
2. The hosting page is minified, inlined and gzipped, to one single condensed webrequest.
3. All interaction with the hardware, retrieving sensorvalues, setting switches, ... is done in short json based get/post requests.

## Structure of the sourcefiles

> Project Root
> - platformio.ini --> platformIO configuration file<br>
> - /src --> c++ source files for the ESP platform, compiled using platformIO<br>
> - /lib --> library files for the ESP platform, compiled using platformIO<br>
> - /webcontent<br>
>     - /node_modules --> nodejs packages, installed automatically with ```npm install```<br>
>     - /dist --> location for generated index.html and index.html.gz (client build scripts)<br>
>     - /src --> source files for the client side (html, scss/css, js, ...)<br>


## getting started
### IDE and tooling
- As a base, I am using **Visual Studio Code** together with the **PlatformIO** extension.
- for compiling SASS, I'm using the **Live Sass Compiler** extension (*ritwickdey.live-sass*)
- for executing build tasks and running the testserver, I use the **Task Explorer** extension (*spmeesseman.vscode-taskexplorer*)

### setting up the project
1. Either start from a clone of this repository, or copy the webcontent folder in an existing platformIO project folder
2. run ```npm install``` from within the webcontent folder. this will create the node_modules subfolder and fetch all the required tools for building and testing.

## Building the client application
With the task explorer pane in visual studio code, the **clientside** can be build with the *gulp scripts*
- **buildClient_inline** : generates all html, js and css files combined into one single index.html and the compressed version in index.html.gz. files are stored in the dist folder.
- **buildClient_embeded** : geneates the index.html.gz.h file that can be referenced from within the ESP code.

## Running the application with the local devserver
with the task explorer pane in visual studio code, the client can be tested using the local devserver
the configuration is done in ```devserver-config.yaml``` and allows for varying runmodes

```yaml
# MODE SECTION
# possible values are:
# source -> serve all the files from the src directory
# inline -> serve the single combined index.html file (includes transpilation by babel)
# gz     -> serve the gziped version of the combined index.html

mode : gz

# ACTION SECTION
# list of urls that can be called from the client
# typically requests for info, or actions.
# in inline/gz mode, these requests
#   - will be routed to the src folder if the proxy feature is disabled (see below)
#   - will be forwarded to the proxy address if proxy is enabled
action_urls:
    - data.json
    - action
    - reset

# PROXY SECTION
# allows to pass on the action url's to the live esp code running
#
proxy_enabled : false
proxy_address : http://192.168.1.109/

```

## Credits
This project is greatly inspired by the information I found on a tutorial by Xose Pérez on his Tinkerman blog:
 https://tinkerman.cat/post/embed-your-website-in-your-esp8266-firmware-image/
I have used several snippets from the example code Xose posted. 
