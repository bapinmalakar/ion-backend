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
        const files = fs.readdirSync(path.resolve(__dirname, './../uploads'));
        for (let file of files) {
            console.log('delete file: ', file);
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
            const data = await Thermometers.find({})
                .populate({
                    path: 'year_details',
                    model: 'YearDetils'
                })
            return res.status(200).send({ data: data });
        } catch (err) {
            console.log('Error is: ', err);
            return res.status(500).send({ message: 'Something went wrong!' });
        }
    }
}