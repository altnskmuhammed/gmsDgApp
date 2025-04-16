const express = require("express");
const router = express.Router();
const rawMaterialsController = require("../controllers/rawMaterialsController");

router.post("/", rawMaterialsController.addRawMaterial);
router.get("/", rawMaterialsController.getAllRawMaterials);
router.get("/:id", rawMaterialsController.getRawMaterialById);
router.put("/:id", rawMaterialsController.updateRawMaterial);
router.delete("/:id", rawMaterialsController.deleteRawMaterial);

// Kilo (weight) işlemleri
router.post("/:id/weights", rawMaterialsController.addWeight); // Yeni kilo ekleme
router.delete("/:id/weights/:lot", rawMaterialsController.deleteWeight); // Belirli bir kilo silme
router.put("/:id/weights", rawMaterialsController.updateWeights); // Tüm kilo verilerini güncelleme

// Hesaplama işlemleri
router.get("/:id/total-weight", rawMaterialsController.calculateTotalWeight);
router.get("/:id/average-size", rawMaterialsController.calculateAverageSize);

module.exports = router;
