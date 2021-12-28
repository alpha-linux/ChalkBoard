/**
 * @author Ishan Banerjee
 * @description Script to handle screen drawing.
 */

// DEFAULT
var gridLayer = 'gridLayer'
var defaultLayer = 'defaultLayer'
var debug = false;

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

        if (ev.isFirst) {
            if (ev.srcEvent.shiftKey)
                startErase(ev);
            else
                startDraw(ev);
        } else if (ev.isFinal) {
            if (ev.srcEvent.shiftKey)
                endErase(ev);
            else
                endDraw(ev);
        } else {
            if (ev.srcEvent.shiftKey)
                middleErase(ev);
            else
                middleDraw(ev);
        }
    });

    layer = new paper.Layer();
    layer.name = "defaultLayer"

    paper.project.layers[defaultLayer].activate()

    // FUNCTIONS RELATED TO DRAWING

    const startDraw = (ev, properties) => {

        if (debug)
            console.log("Drawing Start");

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

        if (debug)
            console.log("Drawing...")

        if (lastIndex == -1)
            return
        paper.project.layers[defaultLayer].children[lastIndex].add({ x: ev.center.x, y: ev.center.y });
    }

    const endDraw = (ev) => {

        if (debug)
            console.log("Drawing End")

        if (lastIndex == -1)
            return
        paper.project.layers[defaultLayer].children[lastIndex].simplify(8);
        lastIndex = -1;
    }

    // FUNCTIONS RELATED TO ERASING

    const startErase = (ev) => {

        if (debug)
            console.log("Erasing Start")

        var erasePath = new paper.Path({
            strokeWidth: EraserModule.eraserWidth * view.pixelRatio,
            strokeCap: EraserModule.eraserCap,
            strokeJoin: EraserModule.eraserJoin,
            strokeColor: EraserModule.eraserColor,
        });

        let p = paper.project.layers[defaultLayer].addChild(erasePath);
        lastIndex = p.index;
    }

    const middleErase = (ev) => {

        if (debug)
            console.log("Erasing...")

        if (lastIndex == -1)
            return

        paper.project.layers[defaultLayer].children[lastIndex].add({ x: ev.center.x, y: ev.center.y });
    }

    const endErase = (en) => {

        if(debug)
            console.log("Erasing End")
        
            if (lastIndex == -1)
            return
        
        earasingCleanUp(lastIndex);
        lastIndex = -1;
    }

    function earasingCleanUp(index){
        paper.project.layers[defaultLayer].children[index].blendMode = 'destination-out';
    }

});


