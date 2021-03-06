var clickRecord = false;
var lock = false;
var command="", option="", commandOption="";
  $(document).keydown(function(event) {
    if (event.key == " " && clickRecord == false && lock==false) {
        openToolBar();
        clickRecord = true;
    }else{
      closeToolBar();
      clickRecord = false;
    }
  });
  
  $(document).keydown(function(event){
    if(event.key == "/"){
    openCommandLine();
    }
    if(event.key == "Escape")
      closeCommandLine();
    if(event.key == "ArrowUp" || event.key == "ArrowDown")
      historyRecall(event);
  });
  
  $(document).on("keydown", ":input:not(textarea)", function(event){
    if(event.key == "Enter"){
      event.preventDefault();
      commandExecute();
    }
  });

var buttonElementContainer = 7;

function openToolBar(){
  document.getElementById('toolbar').style.width = "2.7em";
  for(let i=0;i<buttonElementContainer;i++)
    document.getElementsByClassName('tool')[i].style.width = "35px"
}

function closeToolBar(){
  document.getElementById('toolbar').style.width = "0em";
  for(let i=0;i<buttonElementContainer;i++)
  document.getElementsByClassName('tool')[i].style.width = "0px"
}

function openCommandLine(){
  document.getElementById('footer').style.height = "40px";
  document.getElementById('cli').focus();
  lock = true;
}

function closeCommandLine(){
  document.getElementById('footer').style.height = "0";
  updatePrompt("");
  document.getElementById('cli').blur();
  lock = false;
}

function commandExecute(){
  commandStack.push(document.getElementById("cli").value);
  direction = commandStack.length;
  if(commandStack[direction -1].includes("=")){
    commandOption = commandStack[direction - 1].split("=");
    command = commandOption[0];
    option = commandOption[1];
  }else
    command = commandStack[direction -1];
  processCommand();
  updatePrompt("");

}

function historyRecall(event){
  if(event.key == "ArrowUp"){
    if(--direction >=0)
    updatePrompt(commandStack[direction])
    else
      ++direction
  }
  if(event.key == "ArrowDown"){
    if(direction == 0)
      updatePrompt(commandStack[direction++]);

    else if(direction < commandStack.length)
      updatePrompt(commandStack[direction++]);
    else
      updatePrompt("");
  } 
}

function updatePrompt(command){
  document.getElementById('cli').value = command;
  setTimeout(function(){document.getElementById('cli').setSelectionRange(command.length,command.length)},0)

}
