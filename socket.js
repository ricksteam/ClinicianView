var express = require('express');
var path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var port = 3000;

var numOfClients = 0;

app.use(express.static(path.join(__dirname, 'static')));


io.on('connection', function(socket){
  console.log('SERVER: a user connected');
  
  socket.on('clientConnect', function(){
    numOfClients++;
    console.log("Clients connected: " + numOfClients);
    //socket.emit('bye', "From server");
    
  });
  
  socket.on('sendData', function(data){
    socket.emit("sendData", data);
  });
  socket.on('disconnect', function(){
    numOfClients--;
    console.log("disconnected");
  });
});


// Listen for requests
var server = http.listen(port, function() {
  console.log('Loaded on port: ' + port);
});