'use strict';

const express = require('express');
const router = require('express').Router();
const controller = require('./../controller');

module.exports = () => {

    //all post request
    router.post('/upload_file', controller.uploadThermoFile);

    //all get request
    router.get('/all_thermo', controller.getAllThermometer);
    
    return router;
}

