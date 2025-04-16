// routes/qualityControlStepRoutes.js
const express = require('express');
const { addQualityControlSteps, getQualityControlSteps,updateQualityControlStep,uploadAttachment,getQualityControlStepMedia  } = require('../controllers/qualityControlStepController');

const router = express.Router();

router.post('/', addQualityControlSteps);
router.get('/', getQualityControlSteps);
router.patch('/', updateQualityControlStep);
router.post("/orders/:orderId/quality-control-steps/:stepId/upload-media", uploadAttachment);
// Route'ları ekleyelim
router.get("/orders/:orderId/quality-control-steps/:stepId/media", getQualityControlStepMedia);
module.exports = router;
