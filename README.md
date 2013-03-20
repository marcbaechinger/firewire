# firewire

This is a first application made with node.js for my convenience reasons. As it's basically a static HTML app it easy to pull it out on othe http platforms.

## Install and run

+ install decent node js version<br/>
    https://github.com/joyent/node/wiki/Installation (on mac I would go for homebrew)
	
+  \# git clone git@github.com:marcbaechinger/firewire.git
+  # cd firewire
+  # npm install
+  # node app.js

No start a browser and go to http://localhost:3000/index.html 


## Use the application

Currently tested on osx with Chrome and Firefox Aurora. 

1. On start you should see the basic UI on the left indicating current time, number of failures and a display for the current state of the game startet/milestone1,2,4/ended. The game is not started yet.

2. Move the mouse cursor to the top right corner to unveil the start game button. Press it. The browser aske for permission to use the webcam (you need on btw :-)

3. The 'game' is initialited now. Now we could start 'challenges'.

4. A 'click' start the challange.

5. Left arrow keystroke is the first milestone.

6. Top arrow keystroke is the second milestone.

7. Right arrow keystroke is the thrid milestone.

8. Down arrow keystroke represents a failure (wire collision)

9. Space key is the goal at the end of the wire.

10. At each of these event a picture is taken and displayed in the browser (no backend yet).





