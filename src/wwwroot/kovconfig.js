// Key to Icon mapping.  Update these according to your personal key binds.
// Note that "Num#" is not referring to the numpad - it's referring to the numbers above qwerty.
// See Button.cs for the list of keys supported.

var IconKeys = { // This list of actions are only triggered on press, but not on release
    "MWheelDown": "/images/punch.png",
    "Mouse5": "/images/punch.png",
//    "Ctrl": "/images/dash.png", // Optional.  You could use the movement.html to display dash instead.
    "Alt": "/images/gren.png",
    "Num2": "/images/grenswap.png",
    "KeyX": "/images/modswap.png",
    "KeyF": "/images/fbelch.png",
    "Mouse3": "/images/chainsaw.png",
    "Shift": "/images/heavyrifle.png",
    "Mouse4": "/images/shotgun.png",
    "KeyE": "/images/ssg.png",
    "KeyQ": "/images/rocket.png",
    "Caps": "/images/ballista.png",
    "KeyR": "/images/chaingun.png",
    "Num3": "/images/plasma.png",
    "KeyZ": "/images/bfg.png",
    "KeyV": "/images/crucible.png"
};

var HeldKeys = { // This list of actions are triggered on press and release.  Make sure the names at the right here match the names at the left on HeldIcons.
    "Mouse2": "altfire",
    "Mouse1": "shoot",
    "Num1": "wepwheel"
};

var HeldIcons = { // These are the images for the held keys above (again, make sure the names match), and the numbers here are which row to force these inputs to show up on.
    "altfire": ["/images/startalt.png", "/images/stopalt.png", 0],
    "shoot": ["/images/startshoot.png", "/images/stopshoot.png", 1],
    "wepwheel": ["/images/startwheel.png", "/images/stopwheel.png", 1]
};

var rowSpacing = 2; // How many pixels to have between rows
var iconTimeoutSpeed = 9; // If different icons get squished together, decrease this.  If it feels like icons are being placed in new rows too much, increase this.
var iconSize = 50; // Square size of images shown.  If you change these, make sure you also tweak .bullet and .bullet.icon in styles.css.
