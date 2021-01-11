//Author Ishan Banerjee

var topLayer
var eraserTool;
var sketchTool;
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

var highlighterMod = {
  highlighterWidth: 35,
  highlighterColor: "rgba(255,255,0,0.4)",
  highlighterCap: "square",
  highlighterJoin: "milter",
}

$( document ).ready(function() {
  paper.install(window);
  paper.setup(document.getElementById("sketcharea"));

    //Layer object instantiated for drawing and erasing.
    topLayer = new Layer();
    
    //A Tool of object of the class paper.js, used for drawing 
    sketchTool = new Tool();
    sketchTool.minDistance = 5;
    sketchTool.activate();

    //Drawing section code
    sketchTool.onMouseDown = function (event) {
        closeCommandLine();
        if(toolSelected == "marker"){
          drawPath = new Path({
            strokeColor: markerMod.markerColor,
            strokeWidth: markerMod.markerWidth * view.pixelRatio,
            strokeCap: markerMod.markerCap,
            strokeJoin: markerMod.markerJoin,
          });
          if(dottedStroke == true)
            drawPath.dashArray = [10,12];
          drawPath.add(event.point, event.point);
        }else if(toolSelected == "high"){
          drawPath = new Path({
            strokeWidth: highlighterMod.highlighterWidth,
            strokeColor: highlighterMod.highlighterColor,
            strokeCap: highlighterMod.highlighterCap,
            storkeJoin: highlighterMod.highlighterJoin,
          });
        }
    };

    sketchTool.onMouseDrag = function (event) {
        if(event.modifiers.shift)
        {
          drawPath.lastSegment.point = event.point;
        }
        else if(event.modifiers.ctrl){
          drawPath.la
        }
        else{
          drawPath.add(event.point);
      }
    };

    sketchTool.onMouseUp = function (event) {
      if(toolSelected == "marker")
          drawPath.simplify(modifiers.correctionVal);
      // drawPath.selected = true; //Shows the physical path of the line. Used for debug purpose. 
    };

    eraserTool = new Tool();
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
        if(event.key == "e" && lock == false) {
          eraserTool.activate();
        }
        else if(event.key == "d" && lock == false) {
          sketchTool.activate();
        }
    });


});

