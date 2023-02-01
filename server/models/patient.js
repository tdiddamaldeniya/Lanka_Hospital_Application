const mongoose = require('mongoose');
const _ = require('lodash');
var {StageOfDisease, Disease} = require('./diseases.js');
var rooms = require('./rooms.js');

// User Schema
var PatientSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	GuardianName: {
		type: String,
		required: true
	},
	dateOfBirth: {
		type: String,
		required: true,
	},
	sex: {
		// true = male
		// false = female
		type: Boolean,
		required: true,
		default: true
	},
	hospitalNumber: {
		type: String,
		required: true,
		unique: true
	},
	diseases: {
        type: Array,
        default: []
     },
     Stage: {
        type: Number,
	   required: true,
	   default: 0
     },
	room: {
		type: String,
		required: true,
		default: 'noroom'
	},
	lastUpdate: {
		type: Number,
		required: true
	}
});

/*
	function to update the diseases and the Stage of a patient
	*Requires the patient to have the diseases already saved in the databases
*/
PatientSchema.methods.updateStage = function () {
	var patient = this;

	// promise to get the patient object inside the diseases callback
	var promise = new Promise(function(resolve, reject) {
		resolve(patient);
		reject(patient);
	})

	Promise.all([promise.then(function (patient) { return patient; }), Disease.find({})])
         .then((data) => {
             var patient = data[0];
             var diseases = data[1];

             var StageOfDisease = {};
             var Stage = 0;

		   if (! _.isEmpty(diseases) && _.isArray(diseases)) {
                 // create a hashmap with the diseases and their Stages
                 for (var i = 0; i < diseases.length; ++i) {
                     StageOfDisease[diseases[i].name] = diseases[i].Stage;
                 }

            	  for (var i = 0; i < patient.diseases.length; ++i) {
	                if (StageOfDisease[patient.diseases[i]] > Stage) {
	        			Stage = StageOfDisease[patient.diseases[i]];
	        	 	 }
             	 }
             }

             patient.Stage = Stage;
             patient.save().catch((err) => {
			   console.log(err);
		   });
         }).catch((err) => {
             console.log(err);
	 });
}

var Patient = mongoose.model('Patient', PatientSchema);
module.exports = {Patient};
