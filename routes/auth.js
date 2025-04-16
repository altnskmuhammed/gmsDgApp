const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { verifyAdmin } = require("../middleware/auth");

router.post("/login", authController.handleLogin);
router.put("/users/:id/role",verifyAdmin, authController.updateRole);

module.exports = router;
