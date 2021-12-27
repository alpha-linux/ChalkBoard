/**
 * @author Ishan Banerjee
 * @description Script to handle screen drawing.
 */

// DEFAULT
var gridLayer = 'gridLayer'
var defaultLayer = 'defaultLayer'
var debug = true;

var lastIndex = -1;


// CLASSES FOR TOOLS

var MarkerModule = {
    markerWidth: 3,
    markerColor: "white",
    markerCap: "round",
    markerJoin: "round",
}

var LaserModule = {
    laserWidth: 3,
    laserColor: "rgba(233,88,88,1)",
    laserHalo: "red",
    laserHaloRadius: 8,
    laserPoint: "round",
    laserJoin: "round"
}

var EraserModule = {
    eraserWidth: 80,
    eraserColor: "rgb(22, 22, 22)",
    eraserCap: "round",
    eraserJoin: "round",
}

var HighlighterModule = {
    highlighterWidth: 35,
    highlighterColor: "rgba(255,255,0,0.4)",
    highlighterCap: "square",
    highlighterJoin: "milter",
}

// READY DOCUMENT
$(document).ready(function () {

    //Initialize Paper.js and Hammer.js

    var touch = new Hammer(document.getElementById("sketcharea"))
    paper.install(window);
    paper.setup(document.getElementById("sketcharea"));

    // Handle touch input
    touch.on("hammer.input", function (ev) {

        if (debug)
            console.log(ev);

        if (ev.isFirst) {
            startDraw(ev);
        } else if (ev.isFinal) {
            endDraw(ev);
        } else {
            middleDraw(ev);
        }
    });

    layer = new paper.Layer();
    layer.name ="defaultLayer"

    paper.project.layers[defaultLayer].activate()

    // FUNCTIONS RELATED TO DRAWING

    const startDraw = (ev, properties) => {

        if (debug)
            console.log("Drawing : ", ev.center.x, ev.center.y);

        var drawPath = new paper.Path({
            strokeColor: MarkerModule.markerColor,
            strokeWidth: MarkerModule.markerWidth * view.pixelRatio,
            strokeCap: MarkerModule.markerCap,
            strokeJoin: MarkerModule.markerJoin,
        });

        let p = paper.project.layers[defaultLayer].addChild(drawPath);
        lastIndex = p.index;
    }

    const middleDraw = (ev) => {
        if (lastIndex == -1)
            return
        paper.project.layers[defaultLayer].children[lastIndex].add({ x: ev.center.x, y: ev.center.y });
        return
    }

    const endDraw = (ev) => {
        if(lastIndex == -1)
            return
        paper.project.layers[defaultLayer].children[lastIndex].simplify(8);
        lastIndex = -1;
    }
});


