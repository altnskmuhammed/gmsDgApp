const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Siparişleri getirme
router.get("/orders", orderController.getAllOrders);

// Sipariş Oluşturma
router.post("/orders", orderController.createOrder);

// Palet Ekleme
router.post("/orders/:orderId/pallets", orderController.addPalletToOrder);

router.get("/orders/:id", orderController.findOrderWithId);

// Palet Silme
router.delete(
  "/orders/:orderId/pallets/:palletId",
  orderController.removePalletFromOrder
);
// Kilo silme
router.delete(
  "/orders/:orderId/pallets/:palletNumber/weights",
  orderController.removeWeights
);


// Palet Düzenleme
router.put(
  "/orders/:orderId/pallets/:palletId",
  orderController.updatePalletInOrder
);
// Order statüs güncelleme
router.put("/orders/:orderId", orderController.updateOrderStatus);
// Palet getirme
router.get("/orders/:orderId/pallets/:palletId", orderController.getPaletById);

module.exports = router;
