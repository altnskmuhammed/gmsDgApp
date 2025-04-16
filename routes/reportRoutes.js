const express = require('express');
const { createReport, updateReport, getReport, getAllReports } = require('../controllers/reportController');
const router = express.Router();

router.post('/reports', createReport);
router.put('/reports/:id', updateReport);
router.get('/reports/:id', getReport);
router.get('/reports', getAllReports);

module.exports = router;
