// Key to Icon mapping.  Update these according to your personal key binds.
// Note that "Num#" is not referring to the numpad - it's referring to the numbers above qwerty.

var IconKeys = { // This list of actions are only triggered on press, but not on release
    "Mouse5": "/images/punch.png",
    "Ctrl": "/images/dash.png",
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

var HeldKeys = { // This list of actions are triggered on press and release
    "Mouse2": "altfire",
    "Mouse1": "shoot",
    "Num1": "wepwheel"
};

var HeldIcons = { // These are the images for the held keys above (make sure the names match), and the numbers here are which row to force these inputs to show up on.
    "altfire": [0, "/images/startalt.png", "/images/stopalt.png"],
    "shoot": [1, "/images/startshoot.png", "/images/stopshoot.png"],
    "wepwheel": [1, "/images/startwheel.png", "/images/stopwheel.png"]
};

// Animation Variables. Feel free to change these to your liking
var frameRate = 60.0; // Make sure to enter this as a float (e.g.: 60.0, 120.0, etc.)
var imgSpeed = 5; // Distance in pixels to move horizontally per frame
var iconSize = 40; // Square size of images shown
var rowSpacing = 2; // How many pixels to have between rows
var iconFade = true; // if "true", fades out linearly as it reaches the right of the window.  If "false", stays fully opaque from start to finish.

/* 
   ------------------------------------------
   RECOMMEND NOT CHANGING ANYTHING BELOW HERE
   ------------------------------------------
*/

// Vars used in calculations
var frameTime = 1000.0 / frameRate; // time in ms between updates
var icons = new Array();
var nextId = 0;
var rowTimes = new Array(); // keep track of how long until each row is free for use again
var rowContent = new Array(); // keep track of the last image used in each row

// Vars dynamically determined via init()
var opacityEnd;
var heightMax;
var widthMax;
var reservedRows;

init();

function lerp(start, end, t) { // Linear interpolation, used for opacity
    return start * (1 - t) + end * t
}

function init() {

    heightMax = document.getElementById("res").clientHeight;
    widthMax = document.getElementById("res").clientWidth;
    opacityEnd = document.getElementById("res").clientWidth;

    reservedRows = 0;
    for (var key in HeldIcons) { // Find out how many rows are reserved by press & release actions
        if (HeldIcons[key][0] > reservedRows) reservedRows = HeldIcons[key][0];
    }

    moveIcons(); // get the infinite loop running
}

function pickRow(src) { // This function is used for one-shot icons that don't have dedicated rows.
    rowNum = reservedRows + 1; // start after the press & release actions
    foundRow = false;
    if (rowContent.indexOf(String(src)) >= 0) { // first, try to find a row with the same content if it was recently used.
        rowNum = rowContent.indexOf(src);
        foundRow = true;
    }

    if (!foundRow) { // next, just find the first open row.
        while (rowTimes[rowNum] > 0) rowNum++; 
    } 

    rowTimes[rowNum] = iconSize; // this counts down in the moveIcons function
    rowContent[rowNum] = src; // and when rowTimes drops below 1, this is cleared
    return (rowNum * (iconSize + rowSpacing));
}

function createIcon(src) { // This function is used for one-shot icons that don't have dedicated rows.
    img = new Image();
    img.src = src;

    var icon = {
        id: nextId,
        x: 0,
        y: pickRow(src),
        fadeout: iconFade,
        image: img
    };
    icons.push(icon);
    nextId++;
}

function createIconAtRow(src, row) { // This function is used for press & release icons that have dedicated rows.
    img = new Image();
    img.src = src;

    var icon = {
        id: nextId,
        x: 0,
        y: row * (iconSize + rowSpacing),
        fadeout: iconFade,
        image: img
    };
    icons.push(icon);
    nextId++;
}

function showIcons() {
    var node = document.getElementById("res");
    var stringToInner = "";
    var src;
    for (var i = 0; i < icons.length; i++) {
        src = icons[i].image.src;
        stringToInner += "<img src =\"" + src +
            "\" id=\"" + icons[i].id + "\" style= \"left: " +
            icons[i].x + "px;top: " + icons[i].y + "px;z-index: " +
            icons[i].id + ";position: absolute;width=\"" + iconSize + "\" height=\"" + iconSize + "\"\">";
        stringToInner += "<br>";
    }
    node.innerHTML = stringToInner;
}

function moveIcons() {
    for (var i = 0; i < icons.length; i++) { // go through icon array one by one
        moveIcon(icons[i]); // and move them
    }

    for (var i = 0; i < rowTimes.length; i++) { // also, decrement the timer for each row
        if (rowTimes[i] > 0) {
            rowTimes[i] -= imgSpeed;
            if (rowTimes[i] <= 0) { // and if the timer hits 0, stop tracking the last content to be placed in that row
                rowContent[i] = ""
            }
        }
    }

    setTimeout(function () { // loop at the desired framerate
        moveIcons()
    }, frameTime);
}

function moveIcon(icon) {
    node = document.getElementById(icon.id);
    if (icon.x < widthMax - node.width) {
        node.style.left = icon.x + "px";
        node.style.top = icon.y + "px";
        if (icon.fadeout == true) {
            node.style.opacity = lerp(1, 0, icon.x / opacityEnd);
//            console.log("Set icon " + icon.id + "'s opacity to: " + lerp(1, 0, icon.x / opacityEnd));
        }
        icon.x += imgSpeed;
    } else {
        node.style.opacity = 0; // We've hit the edge, so set the opacity to 0
        icons.splice(0, 1); // and remove it from the array
        if (icons.length == 0) nextId = 0; // and reset the z index if we don't have anything animating.
    }
}

(function () {
    window.listenEvents = function (eventType) {
        var ws = new WebSocket('ws://localhost:5001/ws');
        ws.onopen = function () {
            ws.send(JSON.stringify({ eventMask: eventType }));
        };
        ws.onmessage = function (event) {
            var data = JSON.parse(event.data);

            if (data.type == 0) {
                ws.send(JSON.stringify({ ping: data.ping }));
            }

            if (data.pressed) { // key/button pressed
                if (data.button in IconKeys) { // Is this a one-off key press?
                    createIcon(IconKeys[data.button]);
                    showIcons();
                }
                if (data.button in HeldKeys) { // Or is it one that we handle press and release separately?
                    icon = HeldIcons[HeldKeys[data.button]];
                    createIconAtRow(icon[1], icon[0]);
                    showIcons();
                }
            }
            else { // key/button released
                if (data.button in HeldKeys) { // Is it one where we worry about release?
                    createIconAtRow(icon[2], icon[0]);
                    showIcons();
                }
            }

        };
    };
})();
