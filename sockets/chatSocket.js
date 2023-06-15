module.exports = io => {
  io.on('connection', (socket) => {
    
    console.log("connected to server")

    // Join a chat room
    //const chatRooms = []
    var clients = []
    socket.on('join', (userId) => {
      // socket.join(chatId);
      // chatRooms[chatId] = chatRooms[chatId] || [];
      // chatRooms[chatId].push(socket.id);
      // console.log(chatRooms)
      console.log(`User ${socket} joined room ${userId}`);
      clients[userId] = socket
      console.log(clients)
    });
    
    // Listen for a message from the client
    socket.on('msg', (msg) => {
      // Send the message to all sockets in the room
      // console.log("chat from client side : " + msg.chat)
      // console.log("content from client side : " + msg.content)
      //io.to(msg.chat).emit('res', {content: msg.content, time: msg.time});
      console.log(msg)
      let targetId = msg.targetId;
      if(clients[targetId]) clients[targetId].emit('res', msg)
    });
      
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
    
  });    
}