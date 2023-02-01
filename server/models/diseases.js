/*
	mongoDB Schema for diseases
*/
const mongoose = require ('mongoose');

var DiseaseSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
	   required: true 
    },
    Stage: {
        type: Number,
        required: true,
        default: 0
    }
});

var Disease = mongoose.model('Disease', DiseaseSchema);



var StageOfDisease = {}; // empty map

module.exports = {StageOfDisease, Disease};
