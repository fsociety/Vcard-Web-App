import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRouter from './routes/auth.js';
import vcardRouter from './routes/vcard.js';

dotenv.config();

var app = express();

//mongodb connection
mongoose
.connect(process.env.MONGODB,{ useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => console.log("Connected mongodb"))
.catch((err) => console.log(err));

// view engine setup
app.set('views', path.join('views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join('public')));
app.use(express.static(path.join('client/build')));

var corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use('/api/auth', authRouter);
app.use('/api/vcard', vcardRouter);

app.get('*', (req, res) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      res.status(200).json({success: 'Development'});
    break;
  
    default:
      res.sendFile(path.resolve('client/build', 'index.html'));
    break;
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
