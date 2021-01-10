//Autor Ishan Banerjee

var commandStack = [];
var direction = 0;

processCommand(command)
{
    switch(command){
        case "help": console.log("Help")
            break;
        case "clear": console.log("Clear")
            break;
        case "tool": console.log("Tool")
            break;
        case "ms": marker(command);
            break;
        case "mc": marker(command);
            break;
        case "es": eraser();
            break;
        case "hs":
            break;
        case "hc":
            break;
        case "cc":
            break;
        default:
    }
}

//The marker function adjusts the properties (marker size, color, etc.) 
// associated with the marker tool. 
function marker(command){
    let commandOption = commandStack[direction - 1].split("=")
    if(command == "ms"){
        let option = parseFloat(commandOption[1]);
        if(option >= 0.5 && option <= 10)
            modifiers.markerWidth = option;
        else
            updatePrompt("ERROR: Invalid option for ms command [RANGE 0.5 - 10]")
    }else
        modifiers.markerColor = commandOption[1];
}

//The eraser function adjusts the the size of the eraser
function eraser(){
    let commandOption = commandStack[direction - 1].split("=")
    let option = parseInt(commandOption[1]);
    if(option >=5 && option <= 10)
        modifiers.eraseWidth = option;
}