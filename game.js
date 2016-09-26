(function() {
    var canvas;
    var context;
    var width;
    var height;
    var interval_id;
    var moveUp = false;
    var moveDown = true;
    var player = {
      x: 350,
      y: 450,
      size: 25 
    };
    var Name = "";  
    var bar = {
	x: 1325,
	y: 0,
	xchange: 15,
	ychange: 0,
	width: 75,
	height: 900
	};
    var gap = {
	x: bar.x,
	y: getRandomNumber(50, 700),
	height: 175,
	width: 75,
	xchange: 15,
	ychange: 0
	};
    var points = 0;

    
  document.addEventListener('DOMContentLoaded', init, false);
  
  
  function init(){
	window.addEventListener('keydown', activate, false);
	window.addEventListener('keyup', deactivate, false);
	canvas = document.querySelector("canvas");
	context = canvas.getContext('2d');
	width = canvas.width;
	height = canvas.height;
	interval_id = window.setInterval(play, 33);
  }
  
  
  function handle_response() {
       if ( request.readyState === 4 ) {
	   if ( request.status === 200 ) {
	     var again = confirm("Congrats! You have been entered into our leaderboards!\nPlay again?" );
	     if ( again == true){
	      window.location.reload();
	     }
	   }
      }
  }
       
    function activate(event){
	var keyCode = event.keyCode
	if (keyCode == 32){
	    moveUp = true;
	    moveDown = false;
	}
    }
    
    function deactivate(event){
	var keyCode = event.keyCode
	if (keyCode == 32){
	    moveUp = false;
	    moveDown = true;
	
	}
       }

    function play(){
	context.clearRect(0, 0, width, height);
	context.fillStyle = 'green';
	context.fillRect(bar.x, bar.y, bar.width, bar.height);
	context.fillStyle = "white";
	context.fillRect( gap.x, gap.y, gap.width, gap.height);
	context.fillStyle = 'yellow';
        context.fillRect(player.x, player.y, player.size, player.size);

	if (moveUp){
	    player.y -= 40;
	    bar.x = bar.x - bar.xchange;
	    bar.y = bar.y + bar.ychange;
	    gap.x -= gap.xchange;
	    gap.y = gap.y + gap.ychange;
	}
	else if (moveDown){
	    player.y += 15;
	    bar.x = bar.x - bar.xchange;
	    bar.y = bar.y + bar.ychange;
	    gap.x -= gap.xchange;
	    gap.y = gap.y + gap.ychange;
	}
	
	if (cleared()){
	  if(player.x == gap.x + gap.width){
	    points += 1;
	  }
	}
	else if (collides()) {
        stop();
	return;
	}
	 if (bar.x + bar.width <= 0||
	     gap.x + gap.width <= 0){
	     bar.x = canvas.width;
	     gap.x = canvas.width;
	     gap.y = getRandomNumber(50, 700)
	 }
	 
	
	if (player.x + player.size <= 0||
	    player.x + player.size > width||
	    player.y + player.size <= 0||
	    player.y + player.size >= height){
		stop();
	}
	
	document.documentElement.addEventListener('keydown', function (e) {
	  if ( ( e.keycode || e.which ) == 32) {
	    e.preventDefault();
	  }
	}, false);
	
    }
	
    function cleared(){
	if (player.x + player.size < gap.x||
		gap.x + gap.width < player.x|
		player.y > gap.y + gap.height||
		gap.y > player.y + player.size){
			return false;
		}
		else {
			return true;
		  }
	}
	
    function collides(){
	if (player.x + player.size < bar.x ||
            bar.x + bar.width < player.x ||
            player.y > bar.y + bar.height ||
            bar.y > player.y + player.size) {
            return false;
        } else {
            return true;   
	}
     }

    function stop() {
        clearInterval(interval_id);
	var Name = window.prompt('YOU LOSE! You scored '+points+'!\nEnter your name to save your score!','')
	if ( Name.length > 0){
	  var url = 'index.py?username='+Name+'&points='+points+'';
	  request = new XMLHttpRequest();
	  request.addEventListener('readystatechange', handle_response, false);
	  request.open('POST',url, true);
 	  request.send(null);
	}
	else {
	  alert("You didn't enter any name. You will not be saved in our leaderboards.");
	}
    }
    
    function getRandomNumber(min, max){
        return Math.round(Math.random() * (max - min)) + min;
    }
        
	
})();