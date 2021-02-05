//Author Ishan Banerjee

var bottomLayer;
var topLayer;
var eraserTool;
var sketchTool;
var pointMode = false;

var markerMod = {
  markerWidth: 3,
  markerColor: "white",
  markerCap: "round",
  markerJoin: "round",
}

var laserMod = {
  laserWidth: 3,
  laserColor: "rgba(233,88,88,1)",
  laserHalo: "red",
  laserHaloRadius: 8,
  laserPoint: "round",
  laserJoin: "round"
}

var eraserMod = {
  eraserWidth: 80,
  eraserColor: "rgb(22, 22, 22)",
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

   
    bottomLayer = new Layer();
    var viewport = project.view.bounds;
    var verticalWidth = viewport.height;
    var horizontalWidth = viewport.width;
    for(var i=1;i<viewport.width;i += 27.95){
      new Path.Line ({
        from: [i,0],
        to: [i,verticalWidth],
        strokeColor: "#292929",
      });
      new Path.Line({
        from: [0,i],
        to: [horizontalWidth,i],
        strokeColor: "#292929",
      })
  }
  bottomLayer.visible = false;

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
        else{
          drawPath.add(event.point);
          drawPath.smooth();
      }
    };

    sketchTool.onMouseUp = function (event) {
      if(toolSelected == "marker"){
        if(pointMode == true){
          var pointCircle = new Path.Circle({
            center: event.point,
            radius: 6
          })
          pointCircle.strokeColor = '#49baeb'
          pointCircle.fillColor = "#87ceeb"
        }
      }
      // drawPath.selected = true; //Shows the physical path of the line. Used for debug purpose. 
    };

    eraserTool = new Tool();
    eraserTool.minDistance = 10;
    var eraserPath, tmpGroup, mask;

    //Erasing section code

    eraserTool.onMouseDown = function(){
      closeCommandLine();
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

    laserTool = new Tool();
    laserTool.onMouseDown = function () {
      closeCommandLine();
      laserPath = new Path({
        strokeColor: laserMod.laserColor,
        strokeWidth:  laserMod.laserWidth * view.pixelRatio,
        shadowColor: laserMod.laserHalo,
        shadowBlur: laserMod.laserHaloRadius,
        strokeCap: laserMod.laserPoint,
        strokeJoin: laserMod.laserJoin,
      });
    }

    laserTool.onMouseDrag = function(event){
      laserPath.add(event.point);
      laserPath.smooth();
    }

    laserTool.onMouseUp = function(){
      laserPath.removeSegments();
    }

    $(document).keypress(function (event){
        if(event.key == "e" && lock == false) {
          eraserTool.activate();
        }
        else if(event.key == "d" && lock == false) {
          sketchTool.activate();
        }else if(event.key == "l" && lock == false){
          laserTool.activate();
        }
    });


});

