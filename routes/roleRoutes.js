const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

router.post('/roles', roleController.addRole);
router.get('/roles', roleController.getRoles);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id', roleController.deleteRole);

module.exports = router;
