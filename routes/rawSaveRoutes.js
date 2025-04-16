const express = require("express");
const upload = require("../middleware/upload"); // Multer middleware
const { createRawMaterial, getAllRawMaterials, getRawMaterialById, updateRawMaterial, deleteRawMaterial } = require("../controllers/rawSaveController");

const router = express.Router();



// Ham madde işlemleri
router.post("/", upload.array("images", 5), createRawMaterial); // En fazla 5 resim yükleme
router.get("/", getAllRawMaterials);
router.get("/:id", getRawMaterialById);
router.put("/:id", upload.array("images", 5), updateRawMaterial);
router.delete("/:id", deleteRawMaterial);

module.exports = router;
