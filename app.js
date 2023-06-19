const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const rateLimit = require('express-rate-limit'); // security
const helmet = require('helmet'); // security
const mongoSanitize = require('express-mongo-sanitize'); // security
const xss = require('xss-clean'); // security
const hpp = require('hpp'); // security
const fileUpload = require('express-fileupload');
const AppError = require('./utils/appError');
const tourRouter = require('./Routes/tourRouter');
const userRouter = require('./Routes/userRouter');
const postRouter = require('./Routes/postRouter');
const chatRouter = require('./Routes/chatRoutes');
const paymentRouter = require('./Routes/paymentRoutes');
const messageRouter = require('./Routes/messageRoutes');
const adminRouter = require('./Routes/adminRoutes');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// Global MiddleWares

//set security http headers
app.use(helmet()); // set el htttp headers property

//development logging
if (process.env.NODE_ENV === 'development') {
  // app.use(morgan('dev'));
  morganBody(app, {
    logAllReqHeader: true,
  });
}

//Limit requests from same API
// hna bn3ml limitng l3dd el mrat elly log in 34an  el brute force attacks
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests please try again later',
});

app.use(
  fileUpload({
    //for upload files
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);
app.use('/api', limiter); // (/api)=> all routes start with /api

//Body parser,reading data from body into req.body
app.use(express.json()); //middle ware for req,res json files 3and req.body

//Data sanitization against no SQL injection
app.use(mongoSanitize());

//Data sanitization against cross site scripting attacks (XSS)
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ], // loo fe al apifeatures 7t 2 value fe el query yasr4 3la kolo
  })
);

//serving static files
app.use(express.static(`${__dirname}/public`));

//app.use(express.json({limit:'10kb'})); => limit of data in body not more than 10 KB
// asdsfasdfsa
//request time of API
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//Route Handlers

//function:routing handler, path:route
/*app.get('/api/v1/tours', GetAllTours);
app.post('/api/v1/tours', AddTour);
app.get('/api/v1/tours/:id', GetTour);
app.patch('/api/v1/tours/:id', UpdateTour);
app.delete('/api/v1/tours/:id', DeleteTour);
*/

//Routes

app.get('/',(req,res)=>{
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(`<!DOCTYPE html>
  <html>
  <head>
    <title>Welcome to Our Website</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      header {
        background-color: #333;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
      h1 {
        margin: 0;
      }
      section {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 50px;
      }
      .member-card {
        background-color: #f2f2f2;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        margin: 20px;
        padding: 20px;
        text-align: center;
        width: 300px;
      }
      .member-card img {
        border-radius: 50%;
        height: 150px;
        width: 150px;
      }
      .member-card h2 {
        margin-top: 20px;
      }
      .member-card p {
        margin: 10px 0 20px 0;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Welcome to Our Back-End Server</h1>
    </header>
    <section>
      <div class="member-card">
        <img src="https://example.com/team-member-1.jpg" alt="Team Member 1">
        <h2>Farouk Adel</h2>
        <p>Back-End Developer</p>
      </div>
      <div class="member-card">
        <img src="https://example.com/team-member-2.jpg" alt="Team Member 2">
        <h2>Mohammed Ahmed</h2>
        <p>Flutter Developer</p>
      </div>
      <div class="member-card">
        <img src="https://example.com/team-member-3.jpg" alt="Team Member 3">
        <h2>Manar Adel</h2>
        <p>Flutter Developer</p>
      </div>
          <div class="member-card">
        <img src="https://example.com/team-member-3.jpg" alt="Team Member 3">
        <h2>Sohila Wahed</h2>
        <p>Back-End Developer</p>
      </div>
          <div class="member-card">
        <img src="https://example.com/team-member-3.jpg" alt="Team Member 3">
        <h2>Ahmed Shaban</h2>
        <p>Flutter Developer</p>
      </div>
    </section>
  </body>
  </html>`);
  res.end();
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/admin', adminRouter);
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find the url ${req.originalUrl} on this server`);
  // err.status='fail';
  // err.statusCode=404;
  next(
    new AppError(`Can't find the url ${req.originalUrl} on this server`, 404)
  );
});
app.use(globalErrorHandler);

module.exports = app;
