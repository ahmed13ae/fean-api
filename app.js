const express = require("express");
const courseRouter = require("./routes/courseRouter");
const userRouter = require("./routes/userRouter");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xssSanitize=require('./utils/xssSanitize')

const app = express(); 
//global middlewares
//set secuirty http
app.use(helmet());
//rate limiting
const limiter=rateLimit({
  max:100,
  windowMs:15*60*1000,
  message:"too many request from this ip! please try again in 15 mins"
});
app.use('/api',limiter);
//req body parser
app.use(express.json({limit:'10kb'}));
//data sanitization against nosql ingection
app.use(mongoSanitize());
//data sanitization against xss attacks
app.use(xssSanitize);
//testmiddleware--------------------------------------
app.get("/", (req, res) => {
  res.end("hello world");
});
//courses
app.use("/api/courses", courseRouter);
//users
app.use("/api/users", userRouter);

//404 handler
app.all("*", (req, res, next) => {
  //   err=new Error(`cant find ${req.originalUrl} on the server!`);
  //   err.statusCode=404;
  next(new AppError(`cant find ${req.originalUrl} on the server!`, 404));
});

//error hander
app.use(errorHandler);
module.exports = app;
