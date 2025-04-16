const express = require('express');
const router = express.Router();
const questionController = require('../controllers/boatCheckListController');
const responseController = require('../controllers/responseController');

// Question Routes
router.post('/checklists', questionController.createChecklist); // Yeni checklist oluştur
router.get('/checklists/:checklistId/questions', questionController.getQuestionsByChecklist); // Checklist'e ait soruları getir
router.put('/checklists/:checklistId/questions/:questionId', questionController.updateQuestion); // Soruyu güncelle
router.delete('/checklists/:checklistId/questions/:questionId', questionController.deleteQuestion); // Soruyu sil

// Response Routes
router.post('/responses', responseController.createResponseList); // Yeni cevap listesi oluştur
router.get('/responses', responseController.getResponseList); // Haftaya ait cevap listesini getir
router.put('/responses/:responseId', responseController.updateResponseList); // Cevapları güncelle

module.exports = router;
