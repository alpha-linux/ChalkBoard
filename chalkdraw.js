//Author Ishan Banerjee
window.onload = function () {
    paper.install(window);
    paper.setup(document.getElementById("sketcharea"));

    //This class modifies the features of pen and eraser.
    var modifiers = {
      markerWidth: 5,
      eraseWidth: 50,
      markerColor: "#ffffff",
      correctionVal: 8,
    };

    //Layer object instantiated for the background pattern.
    var bottomLayer = new Layer();

    //Layer object instantiated for drawing and erasing.
    var topLayer = new Layer();

    //A Tool of object of the class paper.js, used for drawing 
    var markerTool = new Tool();

    //Drawing section code
    markerTool.onMouseDown = function (event) {
      drawPath = new Path({
        strokeColor: modifiers.markerColor,
        strokeWidth: modifiers.markerWidth * view.pixelRatio,
        strokeCap: "round",
        strokeJoin: "round",
      });
    };

    markerTool.onMouseDrag = function (event) {
      drawPath.add(event.point);
    };

    markerTool.onMouseUp = function (event) {
      drawPath.simplify(modifiers.correctionVal);
    };
  };