'use strict'
const multer = require('multer'),
    [fs, path] = [require('fs'), require('path')],
    mongoose = require('mongoose'),
    Thermometers = mongoose.model('Thermometers'),
    YearDetils = mongoose.model('YearDetils');

const dir = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).any();

module.exports = {
    uploadThermoFile: async (req, res, next) => {
        //upload new thermometer file and save to local for process
        const files = fs.readdirSync(path.resolve(__dirname, './../uploads'));
        for (let file of files) {
            fs.unlinkSync(path.resolve(__dirname, `./../uploads/${file}`));
        }

        upload(req, res, (err) => {
            if (err) {
                return res.status(500).send({ messge: 'Upload a file' })
            } else {
                return res.status(200).send({ messge: 'done' });
            }
        });
    },

    getAllThermometer: async (req, res) => {
        try {
            //function for get the list of thermometer in DESC order
            const data = await Thermometers.find({},{_id: 1, name: 1}).sort({ _id: -1 });
            return res.status(200).send({ data: data });
        } catch (err) {
            console.log('Error is: ', err);
            return res.status(500).send({ message: 'Something went wrong!' });
        }
    },

    getThermometerDetails: async (req, res) => {
        try {
            //get details of a thermometer by name
            const data = await Thermometers.findOne({ name: req.params.thermo_name }).populate({
                path: 'year_details',
                model: 'YearDetils'
            }).lean();
            return res.status(200).send({ data: data });
        } catch (err) {
            console.log('Error is: ', err);
            return res.status(404).send({ err: 'Something went wrong' });
        }
    }
}