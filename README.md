# DoomEternal.InputOverlay
Input overlay plugin for OBS. Supported systems: Windows 10 x64

This is a fork of Zergatul's work from: https://github.com/Zergatul/Zergatul.Obs.InputOverlay/

There are two OBS sources that you can independently add:
1. One to display a histogram of inputs over the last few seconds that scrolls across your screen.  When two icons are vertically aligned, it means that they were pressed at the same time.  This is intended to show the speed of inputs required for certain advanced techniques.
1. A second one to display movement inputs, including the four directional movement keys, dash, and jump.

# Installation
1. Download latest release here: https://github.com/KovaaK/DoomEternal.InputOverlay/releases
1. Unzip it to any location you want

# Histogram Configuration
1. Go to the wwwroot folder, and open up config.js in Notepad.
1. Change the key binds to match the ones that you use in Doom Eternal.  Don't forget to update the three "HeldKeys" a little below the first list too.
1. (Optional: delete any lines for key binds that you don't want to include in the time histogram)
1. If you already have the OBS source running, be sure to select the DE Input Overlay and click refresh to make it update with your key binds.

# Movement Key Configuration
1. Go to the wwwroot folder, and open up movement.html in Notepad.
1. Search for "id=" and change any inputs there as necessary.  Defaults are WASD to move, Shift to dash, and Space to Jump.

# Basic usage
1. Run `Zergatul.Obs.InputOverlay.exe`, and keep it open while you want to use input overlay in OBS
1. In OBS, add Source 🡒 Browser.
    - Name it something like "DE Input Overlay"
    - `URL`: `http://localhost:5001/de.html`
    - `Width`: `960`, `Height`: `540`
    - Check `Use custom framerate`, and set FPS to `60`, if you are streaming/recording in 60 FPS
    - Check `Shutdown source when not visible`. This will allow you to hide/show source after you restart the server
	- I recommend leaving this source at the top left of your screen
1. Add Source 🡒 Browser.
    - Name it something like "Movement Overlay"
    - `URL`: `http://localhost:5001/keyboard.html`
    - `Width`: `176`, `Height`: `160`
    - Check `Use custom framerate`, and set FPS to `60`, if you are streaming/recording in 60 FPS
    - Check `Shutdown source when not visible`. This will allow you to hide/show source after you restart the server
	- You can right click this source, go to Transpose, and click "Center on Screen" to position it correctly.
	

# Disclaimer from KovaaK:
This application from Zergatul reads keyboard and mouse inputs, and it runs a web server so that any web browser (in this case, OBS source) can connect and see those same inputs then display them in useful ways.  This is only a security concern if you are on unprotected networks and disable your Firewall, but I just want users to understand what's going on under the hood.  Don't run your PC without a Firewall.

# Further information from Zergatul:

# Advanced usage
1. If you are running server application without elevated priviledges, it will not be able to detect your inputs from applications running under administrator. Example: I have game started from Steam, and command prompt, running as Administrator. Server will be able to detect inputs in game, but will show nothing when I type something in command prompt.
1. You can show more keys, change style, colors, animations if you are familiar with HTML and CSS. Check `wwwroot` folder within application folder. It contains HTML, CSS and JavaScript files.
1. If you need to restart server application, you will need to hide sources in OBS, and show them again.

# Build application from sources
You can open solution file in Visual Studio 2019. Program is written in C#, by using ASP.NET Core for web server.
