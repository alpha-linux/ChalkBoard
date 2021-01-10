//Autor Ishan Banerjee

var commandStack = [];
var direction = 0;
var toolSelected="marker";

function processCommand()
{
    switch(command){
        case "/help": console.log("Help")
            break;
        case "/clear":  clearCanvas();
            break;
        case "/tool": toolSelect();
            break;
        case "/ms": markerOptions(); 
            break;
        case "/mc": markerOptions();
            break;
        case "/es": eraserOptions();
            break;
        case "/hs": console.log("HS");
            break;
        case "/hc": highColor()
            break;
        default: console.log("Error")
    }
}

//This fucntion clears the sketch area of all the markings
function clearCanvas(){
    topLayer.removeChildren();
}

//The marker function adjusts the properties (marker size, color, etc.) 
// associated with the marker tool. 
function markerOptions(){
    if(command == "/ms"){
        option = parseFloat(option);
        if(option >= 0.5 && option <= 10)
            markerMod.markerWidth = option;
        else
            console.log("Error in range");
    }else
        markerMod.markerColor = option;
}

//The eraser function adjusts the the size of the eraser
function eraserOptions(){
    option = parseInt(option);
    if(option >=5 && option <= 10)
        modifiers.eraseWidth = option;
    else
        console.log("Error in range")
}

function toolSelect()
{
    switch(option){
        case "marker": {
             toolSelected = "marker"
             sketchTool.activate();
        }
            break;
        case "high":{
            toolSelected = "high"
            sketchTool.activate();
        }
            break;
        case "eraser": {
            toolSelected = "eraser"
            eraserTool.activate();
        }
            break;
        case "compass": {
            toolSelected = "compass"
        }
            break;
        case "protractor":{
            toolSelected = "protractor"
        }
            break;
        case "ruler":{
            toolSelected = "ruler"
        }
            break;
        case "selection":{
            toolSelected = "selection"
        }
            break;
        default:
    }
}

function highColor(){
    switch(option){
        case "yellow" : highlighterMod.highlighterColor = "rgba(255,255,0,0.4)";
            break;
        case "pink" : highlighterMod.highlighterColor = "rgba(255,20,147,0.4)";
            break;
        case "orange" : highlighterMod.highlighterColor = "rgba(243,149,57,0.4)";
            break;
        case "green" : highlighterMod.highlighterColor = "rgba(57,255,20,0.4)";
            break;
        case "blue" : highlighterMod.highlighterColor = "rgba(13,213,252,0.4)";
            break; 
        case "red" : highlighterMod.highlighterColor = "rgba(251,43,17,0.4)";
            break;
        case "white" : highlighterMod.highlighterColor = "rgba(255,255,255,0.4)";
            break;
        default:
    }
}