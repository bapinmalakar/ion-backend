'use strict';

const mongoose = require('mongoose');

const YearDetils = new mongoose.Schema({
    thermometer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Thermometers' },
    months: { type: Array },
    days: { type: Array },
    month_spent: { type: Object },
    day_spent: { type: Object }
}, {
    versionKey: false,
    autoIndex: true,
    timestamps: true
});

module.exports = mongoose.model('YearDetils', YearDetils, 'year_detils')