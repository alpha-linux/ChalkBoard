/**
 * @author Ishan Banerjee
 * @description Script to handle screen drawing.
 */

// DEFAULT

var defaultLayer = 'defaultLayer'
var debug = true;
var dashedStroke = false;
var toolSelected = 'marker';

// TRACKING

var lastIndex = -1;
var lastEvent;
var prevTool;

// CLASSES FOR TOOLS

var Marker = {
    markerWidth: 3,
    markerColor: "white",
    markerCap: "round",
    markerJoin: "round",
    markerSimplificationFactor: 20
}

var Laser = {
    laserWidth: 3,
    laserColor: "rgba(233,88,88,1)",
    laserHalo: "red",
    laserHaloRadius: 12,
    laserPoint: "round",
    laserJoin: "round"
}

var Eraser = {
    eraserWidth: 80,
    eraserColor: "rgb(22, 22, 22)",
    eraserCap: "round",
    eraserJoin: "round"
}

var Highlighter = {
    highlighterWidth: 35,
    highlighterColor: "rgba(255,255,0,0.4)",
    highlighterCap: "square",
    highlighterJoin: "milter"
}


// FEATURES

function clearScreen() {
    paper.project.layers[defaultLayer].removeChildren();
    paper.view.draw();
}

function erasingCleanUp(index) {
    paper.project.layers[defaultLayer].children[index].blendMode = 'destination-out';
}

// READY DOCUMENT
$(document).ready(() => {

    //Initialize Paper.js and Hammer.js .

    var touch = new Hammer(document.getElementById("sketcharea"))
    paper.install(window);
    paper.setup(document.getElementById("sketcharea"));

    // Handle touch input.
    touch.on("hammer.input", (ev) => {

        if (ev.isFirst) {
            if (ev.srcEvent.shiftKey) {
                prevTool = toolSelected
                toolSelected = 'eraser'
                startDraw();
            }
            else {
                startDraw();
            }
        } else if (ev.isFinal) {
            endDraw(ev);
        } else {
            middleDraw(ev);
        }
    });

    $(document).keypress((ev) => {
        if (ev.key == 'h') {
            toolSelected = 'highlighter';
        }
        else if (ev.key == 'l') {
            toolSelected = 'laser';
        }
        else if (ev.key == 'm') {
            toolSelected = 'marker';
        }
    });

    layer = new paper.Layer();
    layer.name = 'defaultLayer'

    paper.project.layers[defaultLayer].activate()

    // FUNCTIONS FOR HANDLING DRAWING/ERASING

    /**
     * @description Handles drawing and erasing fucntionalities.
     */
    function startDraw() {

        if (debug)
            console.log("Drawing Start");

        var drawPath;

        if (toolSelected == 'highlighter') {
            drawPath = new Path({
                strokeWidth: Highlighter.highlighterWidth,
                strokeColor: Highlighter.highlighterColor,
                strokeCap: Highlighter.highlighterCap,
                storkeJoin: Highlighter.highlighterJoin
            });

            if (debug)
                console.log("Highlighter Mode...");
        }

        else if (toolSelected == 'laser') {
            drawPath = new paper.Path({
                strokeColor: Laser.laserColor,
                strokeWidth: Laser.laserWidth * view.pixelRatio,
                shadowColor: Laser.laserHalo,
                shadowBlur: Laser.laserHaloRadius,
                strokeCap: Laser.laserPoint,
                strokeJoin: Laser.laserJoin,
            });

            if (debug)
                console.log("Laser Mode...")
        }

        else if (toolSelected == 'eraser') {
            drawPath = new paper.Path({
                strokeWidth: Eraser.eraserWidth * view.pixelRatio,
                strokeCap: Eraser.eraserCap,
                strokeJoin: Eraser.eraserJoin,
                strokeColor: Eraser.eraserColor,
            });

            if (debug)
                console.log("Eraser Mode...")
        }

        else {
            drawPath = new paper.Path({
                strokeColor: Marker.markerColor,
                strokeWidth: Marker.markerWidth * view.pixelRatio,
                strokeCap: Marker.markerCap,
                strokeJoin: Marker.markerJoin,
            });

            if (dashedStroke)
                drawPath.dashArray = [10, 12];

            if (debug)
                console.log("Marker Mode...")
        }

        let p = paper.project.layers[defaultLayer].addChild(drawPath);
        lastIndex = p.index;
    }

    function middleDraw(ev) {

        if (debug)
            console.log("Drawing...")

        if (lastIndex == -1)
            return
        paper.project.layers[defaultLayer].children[lastIndex].add({ x: ev.center.x, y: ev.center.y });

        if (toolSelected != 'eraser')
            paper.project.layers[defaultLayer].children[lastIndex].smooth('continuous')

    }

    function endDraw(ev) {

        if (debug)
            console.log("Drawing End")

        if (lastIndex == -1)
            return

        if (toolSelected == 'marker') {
            paper.project.layers[defaultLayer].children[lastIndex].simplify(Marker.markerSimplificationFactor);
        }

        else if (toolSelected == 'laser')
            paper.project.layers[defaultLayer].children[lastIndex].removeSegments();

        else if (toolSelected == 'eraser') {
            erasingCleanUp(lastIndex);
            toolSelected = prevTool;
        }
        lastIndex = -1;
    }

});


