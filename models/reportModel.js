const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    regDate: {
        type: String
    },
    hemoglobin: {
        type: String
    },
    rbcCount: {
        type: String
    },
    packedCellVolume: {
        type: String
    },
    lymphocytes: {
        type: String
    },
    plateletCount: {
        type: String
    },
    triidothyronine: {
        type: String
    },
    thyroxine: {
        type: String
    },
    tsg: {
        type: String
    },
    serumUrea: {
        type: String
    },
    serumCreatinine: {
        type: String
    },
    serumSodium: {
        type: String
    },
    serumPotassium: {
        type: String
    },
    serumChlorides: {
        type: String
    },
});

reportSchema = new mongoose.Schema({
    userId: {
        type: String
    },

    customerName: {
        type: String
    },
    testName: {
        type: String
    },
    testOne: testSchema,
    testTwo: testSchema,
    testThree: testSchema,

}, { collection: "report" })

// report is a collection name in the database
const reportModel = mongoose.model('report', reportSchema)
module.exports = reportModel