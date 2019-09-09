'use strict';

const models = require('./model');
const db = require('./db');
const routers = require('./route');
const  cors = require('cors');

module.exports = (app)=> {
    db();
    models();
    app.use(cors());
    app.use('/api', routers());
    return app;
}