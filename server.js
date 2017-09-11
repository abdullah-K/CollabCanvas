/* URL:  
 * https://collab-canvas-project-abdullah-k.c9users.io/
 */

//dependencies:
var express = require('express');
var socket = require('socket.io');
//define app as an express.js application
var app = express();
//specify server port with 'process.env.PORT'
var server = app.listen(process.env.PORT);
//keeps track of Input/Output
var io = socket(server);
//serves files from 'client' folder
app.use(express.static('client'));
//keeps track of usernames
var users = [];
//array to store number of connections to server
var connections = [];

//keeps a count of online users at any given moment
var clientCount = 1;

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New connection detected! (connection id: ' + socket.id);
  connections.push(socket);
  socket.on('mouse', mouseLocation);


  function mouseLocation(coordinates) {
    socket.broadcast.emit('mouse', coordinates);
  }

  //display message when client disconnects
  socket.on('disconnect', function() {
    //  + "(" + socket.username + ")"
    console.log("A client has disconnected");
    users.splice(users.indexOf(socket.username), 1);
    updateUserNames();
    connections.splice(connections.indexOf(socket), 1);
    //console.log("A client has disconnected");
  });

  //new user
  socket.on('newUser', function(data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUserNames();
    io.sockets.emit('clientsNum', clientCount++);
  });
  socket.on('userDisconnect', function() {
    updateUserNames();
    io.sockets.emit('clientsNum', clientCount--);
  });

  //update user names function
  function updateUserNames() {
    io.sockets.emit('getUsers', users);
    console.log("Userlist updated");
  }
}
//test command
console.log("Server is live!");
