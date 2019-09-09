'use strict'
const express = require('express'),
    Socket = require('socket.io'),
    http = require('http'),
    fs = require('fs'),
    path = require('path');

require('dotenv').config();

const config = require('./app/app_config');


const app = express();
const server = http.createServer(app);
config(app);

const socketConnection = require('./app/socket_connection');

const PORT = process.env.PORT;

server.listen(PORT, () => console.log('App is running on port: ', PORT));

const io = Socket.listen(server);
io.set("origins", "*:*");
socketConnection(io);

module.exports = app;



