'use strict';

const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true });

    mongoose.connection.on('connected', () => {
        console.log(`Mongo connected to ${process.env.CONNECTION_STRING}`);
    });
    mongoose.connection.once('open', () => {
        console.log('Connected to mongodb!');
    });
    mongoose.connection.on('error', () => {
        console.error(`Mongoose default connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default connection disconnected');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}