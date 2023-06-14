const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
})
//require('./sockets/chatSocket')(io);

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex:true,
    //useFindAndModify:false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con);
    console.log('DB connection Successfully');
  });

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

