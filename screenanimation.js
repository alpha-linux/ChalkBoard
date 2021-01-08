$(document).keydown(function(event) {
    if (event.which === 32) {
        openToolBar()
    }
  });
  
  
  
function openToolBar(){
    console.log("SpaceBar Triggred")
      document.getElementById('toolbar').style.width = "2.2em";
}