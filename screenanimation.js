var clickrecord = false;

$(document).keydown(function(event) {
    if (event.key == "`" && clickrecord == false) {
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
  
function openToolBar(){
  document.getElementById('toolbar').style.width = "2.4em";
}

function openCommandLine(){
  document.getElementById('footer').style.height = "40px";
  document.getElementById('cli').focus()
}

function closeToolBar(){
  document.getElementById('toolbar').style.width = "0em";
}

function closeCommandLine(){
  document.getElementById('footer').style.height = "0";
}
