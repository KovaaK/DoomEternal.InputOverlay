// Key to Icon mapping.  Update these according to your personal key binds.
// Note that "Num#" is not referring to the numpad - it's referring to the numbers above qwerty.
// See Button.cs for the list of keys supported.

var IconKeys = { // This list of actions are only triggered on press, but not on release
    "MWheelUp": "/images/punch.png",
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

/* 
   ------------------------------------------
   RECOMMEND NOT CHANGING ANYTHING BELOW HERE
   ------------------------------------------
*/

// Vars used to figure out when a row can be used by a different icon.
var rowCooldown = new Array(); // keep track of how long until each row is free for use again
var rowContent = new Array(); // keep track of the last image used in each row
var frameRate = 30.0; // This does not affect the visual animation, so don't worry about increasing it.  It's just for opening up rows to other image types.
var frameTime = 1000.0 / frameRate; // time in ms between decrementing the counter for determining when a row is open for a different icon type

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
    reservedRows = 0;
    for (var key in HeldIcons) { // Find out how many rows are reserved by press & release actions
        if (HeldIcons[key][2] > reservedRows) reservedRows = HeldIcons[key][2];
    }
    manageRowCooldown(); // get the infinite loop running
}

function manageRowCooldown() {
    for (var i = 0; i < rowCooldown.length; i++) { // decrement the timer for each row
        if (rowCooldown[i] > 0) {
            rowCooldown[i] -= iconTimeoutSpeed;
            if (rowCooldown[i] <= 0) { // and if the timer hits 0, stop tracking the last content to be placed in that row
                rowContent[i] = "" // This makes it so that a different icon type can be used in this slot
            }
        }
    }

    setTimeout(function () { // loop at the desired framerate
        manageRowCooldown()
    }, frameTime);
}

function pickRow(src) { // This function is used for one-shot icons that don't have dedicated rows.
    rowNum = reservedRows + 1; // start after the press & release actions
    foundRow = false;
    if (rowContent.indexOf(String(src)) >= 0) { // first, try to find a row with the same content if it was recently used.
        rowNum = rowContent.indexOf(src);
        foundRow = true;
    }

    if (!foundRow) { // next, just find the first open row.
        while (rowCooldown[rowNum] > 0) rowNum++; 
    } 

    rowCooldown[rowNum] = iconSize; // this counts down in the moveIcons function
    rowContent[rowNum] = src; // and when rowCooldown drops below 1, this is cleared
    return rowNum;
}

function createBullet(src, row) {
    const bullet = document.createElement("div");
    const id = '_' + Math.random().toString(36).substr(2, 9);
    bullet.className = "bullet";
    bullet.id = id;
    bullet.style.top = row * (iconSize + rowSpacing) + "px";

    const img = document.createElement("img");
    img.src = src;
    img.className = "icon";

    const box = document.querySelector(".res");
    bullet.appendChild(img);
    box.appendChild(bullet);

    setTimeout(() => {
        document.querySelector(`#${id}`).remove();
    }, 3100);

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
                    icon = IconKeys[data.button];
                    createBullet(icon, pickRow(icon));
                }
                if (data.button in HeldKeys) { // Or is it one that we handle press and release separately?
                    icon = HeldIcons[HeldKeys[data.button]]; // this icon is an array of [start img, stop img, row position]
                    createBullet(icon[0], icon[2]);

                }
            }
            else { // key/button released
                if (data.button in HeldKeys) { // Is it one where we worry about release?
                    icon = HeldIcons[HeldKeys[data.button]]; // this icon is an array of [start img, stop img, row position]
                    createBullet(icon[1], icon[2]);
                }
            }

        };
    };
})();
