//Autor Ishan Banerjee

var commandStack = [];
var direction = 0;
var toolSelected="";

function processCommand()
{
    switch(command){
        case "/help": console.log("Help")
            break;
        case "/clear":  clearCanvas();
            break;
        case "/tool": console.log("Tool")
            break;
        case "/ms": marker(); 
            break;
        case "/mc": marker();
            break;
        case "/es": eraser();
            break;
        case "/hs": console.log("HS");
            break;
        case "/hc": console.log("HC");
            break;
        case "/cc": console.log("CC");
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
function marker(){
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
function eraser(){
    option = parseInt(option);
    if(option >=5 && option <= 10)
        modifiers.eraseWidth = option;
    else
        console.log("Error in range")
}
