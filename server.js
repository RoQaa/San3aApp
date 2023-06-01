const mongoose=require('mongoose');
const dotenv=require('dotenv');
 process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
   console.log(err.name, err.message);
   process.exit(1);
 });
dotenv.config({path:'./config.env'});
const app=require('./app');


const DB=process.env.DATABASE.replace('<password>',process.env.PASSWORD);



mongoose.connect(DB,{
  useNewUrlParser:true,
 // useCreateIndex:true,
  //useFindAndModify:false,
  useUnifiedTopology: true
  
}).then(con=>{
  // console.log(con);
   console.log("DB connection Successfully");
});

// const tourSchema=new mongoose.Schema({
//   name:{
//   type:String,
//   required: [true,'need name']
// },
// rating:{
//   type:Number,
//   default:4.4
// },
// price:{
//   type:Number,
//   required:[true,'must has a price']
// }
// });
// const Tour=mongoose.model('Tour',tourSchema);
//   const testTour= new Tour({
//     name:"lost magfier",
//     price:50
//   })
//   testTour.save().then(doc=>{
//     console.log(doc)
//   }).catch(err=>{
//     console.log(err);
//   })

//console.log(process.env);

const port = process.env.PORT||3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

/* ****************SocketIO***************** */

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: `http://localhost:${port}`,
    // credentials: true,
  },
});

require("./sockets/chatSocket")(io);
