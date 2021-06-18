(function () {


    function addImage(imageFile) {
        var img = document.createElement('IMG');
        img.src = imageFile;
        img.setAttribute('height', '50');
        img.setAttribute('width', '50');

        const parent = document.getElementById('res');
        parent.appendChild(img);

        setTimeout(() => parent.removeChild(img), 2000);
    }

    function moveRight(img) {
        img.style.left = parseInt(img.style.left) + 10 + 'px';
        animate = setTimeout(moveRight, 20);    // call moveRight in 20msec
    }

    var addSvgReleased = function (element) {
        var animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('id', element.id + '-animate');
        animate.setAttribute('attributeType', 'XML');
        animate.setAttribute('attributeName', 'fill-opacity');
        animate.setAttribute('values', '1; 0.0');
        animate.setAttribute('dur', '1250ms');
        animate.setAttribute('fill', 'freeze');
    
        element.appendChild(animate);
        animate.beginElement();
        

    };
    
    var removeSvgReleased = function (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    var state = {};

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
   
            if (eventType == 1 && data.type == 1) {
                if (data.pressed) {
                    state[data.button] = true;
                    var element = document.getElementById(data.button);
                    if (element) {
                        element.classList.remove('released');
                        element.classList.add('pressed');
                        addImage('/images/dash.png');
                    }
                } else {
                    if (state[data.button]) {
                        delete state[data.button];
                        var element = document.getElementById(data.button);
                        if (element) {
                            element.classList.remove('pressed');
                            element.classList.add('released');
                            addImage('/images/melee.png');
                        }
                    }
                }
            }
        
            if (eventType == 2 && data.type == 2) {
                if (data.pressed) { // mouse click down
                    state[data.button] = true;
                    var element = document.getElementById(data.button);
                    if (element) {
                        element.style.fill = '#2DA026';
                        element.style.filter = 'url(#glow)';
                        removeSvgReleased(element);
                        addImage('/images/melee.png');
                    }
                } else { // mouse click up
                    if (state[data.button]) {
                        delete state[data.button];
                        var element = document.getElementById(data.button);
                        if (element) {
                            element.style.fill = '#96CF13';
                            element.style.filter = 'none';
                            addSvgReleased(element);
                            addImage('/images/dash.png');
                        }
                    }
                }
            }
        };
    };
})();
