// GET /app/settings         -> go the settings

const express = require('express');
const router = express.Router();

var {StageOfDisease, Disease} = require('./../server/models/diseases.js');

router.get('/app/manageroom', (req, res) => {

    res.status(200).render('manageroom', {pageTitle: ""});
});

module.exports = router;
