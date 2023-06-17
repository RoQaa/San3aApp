module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('connected to server');

    //login in APP
    const clients = [];
    socket.on('login', (user) => {
      clients[user] = socket.id;
    });

    // review
    socket.on('review', (users) => {
      io.to(clients[users.recieveId]).emit('review', `You take review from ${users.senderName}`);
    });

    //delete post
    socket.on('deletePost', (postId) => {
      io.to(socket.id).emit('deletePost', postId);
    });

    // Join a chat room
    const chatRooms = [];
    socket.on('join', (chatId) => {
      socket.join(chatId);
      chatRooms[chatId] = chatRooms[chatId] || [];
      chatRooms[chatId].push(socket.id);
      console.log(chatRooms);
      console.log(`User ${socket.id} join room ${chatId}`);
    });

    // Listen for a message from the client
    socket.on('msg', (msg) => {
      console.log('chat from client side : ' + msg.chat);
      console.log('content from client side : ' + msg.content);
      io.to(msg.chat)
        .except(socket.id)
        .emit('res', { content: msg.content, time: msg.time });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
