const express = require("express");
const router = express.Router();
const { auth, shipperAuth } = require("../middleware/auth");
const order_controller = require("../controllers/order.controller");


router.get("/orderSuccess", auth, order_controller.orderSuccess);
router.get("/userOrdersHistory", auth, order_controller.userOrdersHistory);
router.get("/ordersToShip", auth, order_controller.ordersToShip);
router.get("/shippedOrders", auth, order_controller.shippedOrders);
router.get("/ordersToShip/markAsShipped", auth, order_controller.markAsShipped);

router.get("/ordersToDeliver", auth, shipperAuth, order_controller.ordersToDeliver);
router.get(
  "/ordersToDeliver/markAsDelivered",
  auth,
  shipperAuth,
  order_controller.markAsDelivered
);

module.exports = router;
