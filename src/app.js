"use strict";
require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const ApiError = require('./utils/ApiError');
const initialize = require('./init');
const httpStatus = require('http-status');
const { errorHandler } = require('./middlewares/error');
const app = express();

(async function() {
  const {
    userController
  } = await initialize();

  // set security HTTP headers
  app.use(helmet());

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // sanitize request data
  app.use(xss());
  app.use(mongoSanitize());

  // enable cors
  app.use(cors());
  app.options('*', cors());

  /* define routes */
  const userRouter = userController.routes();
  app.use('/user', userRouter);

  app.use((_, __, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // handle error
  app.use(errorHandler);
  app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
  }); 
})();



