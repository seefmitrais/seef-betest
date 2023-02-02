"use strict";
require('dotenv').config()  
const { default: mongoose } = require("mongoose");
const { Kafka } = require('kafkajs')
const User = require('./models/user.model');
const UserService = require('./services/user.service');
const UserController = require('./controllers/user.controller');

const initialize = async () => {
    /* init mongodb connection */
    const mongoConnection = await mongoose.createConnection(process.env.MONGODB_URL);
    mongoConnection.on('connected', function () {
        console.log('Successfully connected to mongodb');
    });
    mongoConnection.on('error', function (err) {
        console.log('A mongodb connection error occurred');
    });
    mongoConnection.on('disconnected', function () {
        console.log('Disconnected from mongodb');
    });
    mongoConnection.on('reconnected', function () {
        console.log('Successfully reconnected to mongodb');
    });

    /* init kafka */
    const kafkaClient = new Kafka({
        clientId: process.env.APP_NAME,
        brokers: [process.env.KAFKA_URL]
    });
    
    /* init models */
    const userModel = await User.model(mongoConnection);

    /* init services */
    const userService = new UserService(userModel);

    /* init controller */
    const userController = new UserController(userService);

    return { 
        mongoConnection,  
        userService,
        userController,
        kafkaClient
    };
};

module.exports = initialize;
  