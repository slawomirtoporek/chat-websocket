const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const users = [];
const messages = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('join', (userName) => {
    users.push({ name: userName, id: socket.id });
    socket.broadcast.emit('newUser', 
      { 
        author: 'Chat Bot', 
        content: `${userName} has joined the conversation!` 
      }
    );
  }); 

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => { 
    const index = users.findIndex(user => user.id === socket.id);
    socket.broadcast.emit('userLeft', 
      {
        author: 'Chat Bot', 
        content: `${users[index].name} has left the conversation... :(` 
      }
    );
    if (index !== -1) {
      users.splice(index, 1);
    };
  });

  console.log('I\'ve added a listener on message and disconnect events \n');
});

