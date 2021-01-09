var clickrecord = false;
var spacelock = false;

$(document).keydown(function(event) {
    if (event.key == " " && clickrecord == false && spacelock==false) {
        openToolBar();
        clickrecord = true;
    }else{
      closeToolBar();
      clickrecord = false;
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
      commandexecute();
    }
  });

function openToolBar(){
  document.getElementById('toolbar').style.width = "2.4em";
}

function closeToolBar(){
  document.getElementById('toolbar').style.width = "0em";
}

function openCommandLine(){
  document.getElementById('footer').style.height = "40px";
  document.getElementById('cli').focus();
  spacelock = true;
}

function closeCommandLine(){
  document.getElementById('footer').style.height = "0";
  updatePrompt("");
  document.getElementById('cli').blur();
  spacelock = false;
}

function commandexecute(){
  commandStack.push(document.getElementById("cli").value);
  direction = commandStack.length;
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
}