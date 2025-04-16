// routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

// Mesaj gönderme
router.post('/send', chatController.sendMessage);

// Mesaj geçmişini alma
router.get('/history/:channel', chatController.getMessages);
router.post('/history/:channel', chatController.addChannel);
// Kullanıcıya grant izni verme
router.post('/grant', chatController.grantAccess);
module.exports = router;
