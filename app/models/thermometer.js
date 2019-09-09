'use strict';

const mongoose = require('mongoose');

const Thermometers = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    years: { type: Array },
    year_details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'YearDetils' }]
}, {
    versionKey: false,
    autoIndex: true,
    timestamps: true
});

module.exports = mongoose.model('Thermometers', Thermometers, 'thermometers');