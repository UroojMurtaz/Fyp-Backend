const express = require("express");
const {
  createOrder,
  getSingleOrder,
  getAllOrders,
  shopKeeperOrders,
  getAdminAllOrders,
  changeStatus,
  changeOrderStatus,
  ordersReport,
  ordersReportCustomize,
  Sales,
  LastSixMonths,
  getOrdersDashboard
} = require("../controller/OrderController");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/order/newOrder").post(isAuthenticatedUser, createOrder);
router
  .route("/order/getSingleOrder/:id")
  .get(isAuthenticatedUser, getSingleOrder);
router.route("/order/userorders").get(isAuthenticatedUser, getAllOrders);
router.route("/order/shopKeeperOrders/:id").get(isAuthenticatedUser, shopKeeperOrders);
router.route("/order/getTotal").get(getAdminAllOrders);
router.route("/order/changeStatus/:id").put(changeStatus);
router.route("/order/changeOrderStatus/:id").put(changeOrderStatus);
router.route("/order/OrderReport/:id").get(isAuthenticatedUser, ordersReport);
router.route("/order/OrderReports/:id").get(ordersReportCustomize);
router.route("/order/Sales/:id").get(Sales);
router.route("/order/LastSixMonthsSales/:id").get(LastSixMonths);
router.route("/order/getOrdersDashboard/:id").get(getOrdersDashboard);

module.exports = router;
