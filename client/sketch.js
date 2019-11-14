// /client/sketch.js 
/* global createCanvas,windowWidth,windowHeight,background,io,fill,noStroke,ellipse,clear,mouseX,mouseY,resizeCanvas*/



//store the canvas in a variable
var canvas;
//keeps track of socket.io connections
var socket;

// setup canvas and receive mouse coordinates from ser
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(35);

  socket = io.connect('http://localhost:3030');
  //Socket event called 'mouse' created + make an anonymous callback function to draw the lines on other client's canvases
  socket.on('mouse',
    function(coordinates) {
      fill(255, 32, 52);
      noStroke();
      //create ellipses on the coordinates being received from the server
      ellipse(coordinates.x, coordinates.y, 17, 17);
    }
  );
}

//prevent page scroll and bounce effect for iOS Safari users
document.ontouchmove = function(event){
    event.preventDefault();
}

function draw() {
  //empty
}

// clear the canvas (this function is called when the user presses the 'clear' button)
function clearCanvas(){
  clear();
  background(35);
};

//function to send mouse coordinates to multiple clients
function mouseDragged() {
  //console.log('sending coordinates: ' + mouseX + ', ' + mouseY);
  fill(235);
  noStroke();
  // draw ellipses on client's mouse position
  ellipse(mouseX, mouseY, 17, 17);
  
  // store mouse coordinates in 'coordinates' object
  var coordinates = {
    x: mouseX,
    y: mouseY,
  };

  //send data (mouse coordinates) to server
  socket.emit('mouse', coordinates);
}
function mousePressed() {
  mouseDragged();
}

// resize canvas when the browser window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
