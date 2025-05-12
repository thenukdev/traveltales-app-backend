const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');

// Country routes
router.get('/countries', countryController.getAllCountries);
router.get('/countries/:name', countryController.getCountryByName);

module.exports = router;