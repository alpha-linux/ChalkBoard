//Author Ishan Banerjee

var modifiers = {
  correctionVal: 8,
};

var markerMod = {
  markerWidth: 5,
  markerColor: "White",
  markerCap: "round",
  markerJoin: "round",
}

var eraserMod = {
  eraserWidth: 80,
  eraserColor: "white",
  eraserCap: "round",
  eraserJoin: "round",
}

var highlighter = {
  highlighterWidht: 8,
  highlighterColor: "Yellow",
  highlighterCap: "square",
  highlighterJoin: "milter",
}


$( document ).ready(function() {
    paper.install(window);
    paper.setup(document.getElementById("sketcharea"));

    //This class modifies the features of pen and eraser.


    //Layer object instantiated for the background pattern.
    var bottomLayer = new Layer();

    //Layer object instantiated for drawing and erasing.
    var topLayer = new Layer();

    // var uiLayer = new Layer
    // topLayer.activate();

    //A Tool of object of the class paper.js, used for drawing 
    var markerTool = new Tool();
    markerTool.minDistance = 5;
    markerTool.activate();

    //Drawing section code
    markerTool.onMouseDown = function (event) {
      drawPath = new Path({
        strokeColor: markerMod.markerColor,
        strokeWidth: markerMod.markerWidth * view.pixelRatio,
        strokeCap: markerMod.markerCap,
        strokeJoin: markerMod.markerJoin,
      });
    };

    markerTool.onMouseDrag = function (event) {
      drawPath.add(event.point);
    };

    markerTool.onMouseUp = function (event) {
      drawPath.simplify(modifiers.correctionVal);
      drawPath.selected = true;
    };

    var eraserTool = new Tool();
    eraserTool.minDistance = 10;
    var eraserPath, tmpGroup, mask;

    //Erasing section code
    eraserTool.onMouseDown = function(event){
        eraserPath = new Path({
            strokeWidth: eraserMod.eraserWidth * view.pixelRatio,
            strokeCap: eraserMod.eraserCap,    
            strokeJoin: eraserMod.eraserJoin,
            strokeColor: eraserMod.eraserColor,
        });

        tmpGroup = new Group({
            children: topLayer.removeChildren(),
            blendMode: "source-out",
            insert: false
        });

        mask = new Group({
            children: [eraserPath, tmpGroup],
            blendMode: "source-over",
        });
    };

    eraserTool.onMouseDrag = function (event){
        eraserPath.add(event.point);
    };

    eraserTool.onMouseUp = function (event){
        var eraserRadius = (eraserMod.eraserWidth * view.pixelRatio) / 2;

        var outerPath = OffsetUtils.offsetPath(eraserPath, eraserRadius);
        var innerPath = OffsetUtils.offsetPath(eraserPath, -eraserRadius);
        eraserPath.remove();

        outerPath.insert = false;
        innerPath.insert = false;
        innerPath.reverse();

        var deleteShape = new Path({
            closed: true,
            insert: false,
        });
        deleteShape.addSegments(outerPath.segments);
        deleteShape.addSegments(innerPath.segments);

        var endCaps = new CompoundPath({
            children: [
              new Path.Circle({
                center: eraserPath.firstSegment.point,
                radius: eraserRadius,
              }),
              new Path.Circle({
                center: eraserPath.lastSegment.point,
                radius: eraserRadius,
              }),
            ],
            insert: false,
          });

          deleteShape = deleteShape.unite(endCaps);
          deleteShape.simplify();

          var items = tmpGroup.getItems({overlapping: deleteShape.bounds});

          items.forEach(function (item) {
            var result = item.subtract(deleteShape, {
              trace: false,
              insert: false,
            }); 
    
            if (result.children) {
              
              item.parent.insertChildren(item.index, result.removeChildren());
              item.remove();
            } else {
              if (result.length === 0) {
                item.remove();
              } else {
                item.replaceWith(result);
              }
            }
          });
    
          topLayer.addChildren(tmpGroup.removeChildren());
          mask.remove();
    };
    $(document).keypress(function (event){
        if(event.key == "e") {
          console.log("Eraser Active")
          eraserTool.activate();
        }
        else if(event.key == "d") {
            markerTool.activate();
        }
    });
});

