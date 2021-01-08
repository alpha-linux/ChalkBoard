var clickrecord = false;
var spacelock = false;
var command = "";

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
  // document.getElementById('sketcharea').focus();
  document.getElementById('cli').value = "";
  document.getElementById('cli').blur();
  spacelock = false;
}

function commandexecute(){
  command = document.getElementById("cli").value;
  document.getElementById('cli').value = "";
}
