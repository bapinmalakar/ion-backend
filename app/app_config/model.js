'use strict';

const Thermometers = require('../models/thermometer');
const YearDetils = require('../models/year_details');

module.exports = (app)=> {
    const models = [];
    models.push(Thermometers);
    models.push(YearDetils);
    return models;
}