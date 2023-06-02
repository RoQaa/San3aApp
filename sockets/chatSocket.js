module.exports = io => {
  io.on('connection', (socket) => {
 
    const connectedUsers = []
    connectedUsers[socket.id] = { username: 'Guest', status: 'online' };
    console.log(connectedUsers)
    
    io.emit('user list update', connectedUsers);
  
    // Listen for a disconnection event from the client
    socket.on('disconnect', () => {
      connectedUsers[socket.id].status = 'offline';
      io.emit('user list update', connectedUsers);
      //console.log(connectedUsers)
      delete connectedUsers[socket.id];
      console.log('User disconnected:', socket.id);
    });
  
    // Join a chat room
    const chatRooms = []
    socket.on('join', (chatId) => {
      socket.join(chatId);
      chatRooms[chatId] = chatRooms[chatId] || [];
      chatRooms[chatId].push(socket.id);
      console.log(chatRooms)
      console.log(`User ${socket.id} joined room ${chatId}`);
    });
    
    // Listen for a message from the client
    socket.on('chat message', (message) => {
      // Send the message to all sockets in the room
      console.log(message.chat)
      io.to(message.chat).emit('chat message', message.content);
      
      const now = new Date();
      const sendingtime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });           
      console.log(`The Message was sent at ${sendingtime}.`)

      let count = 0;
      const interval = setInterval(() => {

        count++;
        socket.emit('timeMessage', `This is text message sent from ${count} minute.`);
        //console.log('textMessage', `This is text message sent from ${count} minute.`)
      
        if (count >= 2) {
          clearInterval(interval);
          socket.emit('timeMessage', `The textMessage was sent at ${sendingtime}.`);
          //console.log('textMessage', `The textMessage was sent at ${sendingtime}.`);
        }
      }, 60000); // send message every 60 seconds
  });
    
    // //Leave a chat room
    // socket.on('leave', (room) => {
    //   socket.leave(room);
    //   chatRooms[room] = chatRooms[room].filter((id) => id !== socket.id);
    //   console.log(`User ${socket.id} left room ${room}`);
    // });
  
  });    
}