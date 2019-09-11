'use strict';

const [fs, path] = [require('fs'), require('path')];
const mongoose = require('mongoose');
const Thermometers = mongoose.model('Thermometers');
const YearDetils = mongoose.model('YearDetils');

let filePointer = null;
let allItemsAre = [];

const self = module.exports = {
    readDataFromFile: (fileName) => {
        //read data from uploaded file save in local and create output file as temporary storage
        const obj = {
            years: []
        };
        const fileExit = fs.existsSync(path.resolve(__dirname, `./../uploads/${fileName}.json`));
        if (!fileExit) {
            return false;
        }

        fs.writeFileSync(path.resolve(__dirname, './../uploads/output_file.json'), JSON.stringify(obj));
        let tempData = fs.readFileSync(path.resolve(__dirname, `./../uploads/${fileName}.json`));
        tempData = Buffer.from(tempData).toString();
        allItemsAre = [];
        let i = tempData.trim().length - 1;

        if (tempData[0] != '[') {
            tempData = '[' + tempData; // check first character is [
        }

        if (tempData[i] == ']' || tempData[i] == '}') {
            if (tempData[i] == '}')
                tempData = tempData + ']';
            allItemsAre = JSON.parse(tempData);
        } else {
            while (i >= 0) {
                if (tempData[i] == '}') {
                    break;
                }
                --i;
            }
            tempData = tempData.substring(0, i + 1);
            tempData = tempData + ']';
            allItemsAre = JSON.parse(tempData);
        }
        return true;
    },

    analyticsProcess: (start = 0, limit = 10000) => {
        //process your thermometer data, as chunk of 10,000 element each time
        let analyticsObject = fs.readFileSync(path.resolve(__dirname, './../uploads/output_file.json'));
        analyticsObject = JSON.parse(Buffer.from(analyticsObject).toString());
        const processingData = allItemsAre.splice(start, limit);


        for (let item of processingData) {
            const date = new Date(item.ts);
            const year = date.getFullYear();
            const day = `${date.getDate()}-${self.getMonthName(date.getMonth())}-${year}`;
            const month = `${self.getMonthName(date.getMonth())}-${year}`;
            if (!analyticsObject[year]) {
                analyticsObject.years.push(year);
                analyticsObject[year] = { days: [], months: [], day_spent: {}, month_spent: {} };
            }

            if (!analyticsObject[year]['day_spent'][day]) {
                analyticsObject[year]['days'].push(day);
                analyticsObject[year]['day_spent'][day] = item.val;
            } else {
                analyticsObject[year]['day_spent'][day] += item.val;
            }

            if (!analyticsObject[year]['month_spent'][month]) {
                analyticsObject[year]['months'].push(month);
                analyticsObject[year]['month_spent'][month] = item.val;
            } else {
                analyticsObject[year]['month_spent'][month] += item.val;
            }
        }
        fs.writeFileSync(path.resolve(__dirname, './../uploads/output_file.json'), JSON.stringify(analyticsObject));
        return [analyticsObject, allItemsAre.length ? false : true];
    },

    getMonthName: (month) => {
        //get month name
        return {
            '0': 'Jan',
            '1': 'Feb',
            '2': 'Mar',
            '3': 'Apr',
            '4': 'May',
            '5': 'Jun',
            '6': 'Jul',
            '7': 'Aug',
            '8': 'Sep',
            '9': 'Oct',
            '10': 'Nov',
            '11': 'Dec'
        }[month];
    },

    updateOrAddFile: async (analytics, fileName) => {
        //delete the data of thermometer if exist, and add new thermometer
        const fileData = await Thermometers.findOne({ name: fileName }).lean();
        if (fileData) {
            const taskList = [Thermometers.remove({ _id: fileData._id }), YearDetils.remove({ thermometer: fileData._id })];
            await Promise.all(taskList);
        }

        const thermodata = new Thermometers();
        thermodata['name'] = fileName;
        thermodata['years'] = analytics.years;
        await thermodata.save();

        const taskList = [];
        for (let year of analytics.years) {
            const saveYearData = new YearDetils();
            saveYearData['days'] = analytics[year].days;
            saveYearData['months'] = analytics[year].months;
            saveYearData['day_spent'] = analytics[year].day_spent;
            saveYearData['month_spent'] = analytics[year].month_spent;
            saveYearData['thermometer'] = thermodata._id;
            taskList.push(saveYearData.save());
        }

        const yearData = await Promise.all(taskList);

        const yearDetails = yearData.map(d => d._id);
        await Thermometers.updateOne({ _id: thermodata._id }, { $set: { year_details: yearDetails } });
        fs.unlinkSync(path.resolve(__dirname, `./../uploads/${fileName}.json`));
        fs.unlinkSync(path.resolve(__dirname, `./../uploads/output_file.json`));
    }

}