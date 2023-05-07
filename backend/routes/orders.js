
import express from "express";
const router = express.Router();
import orderController from "../controllers/orderController.js";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

// for user
router.route('/').post(isAuth, orderController.addOrderItems);
router.route('/my').get(isAuth, orderController.getMyOrders);
router.route('/my/:id').get(isAuth, orderController.getMyOrderById);
router.route('/pay/:id').put(isAuth, orderController.updateOrderToPaid);
// for admin
router.route('/single/:id').get(isAuth, isAdmin, orderController.getOrderById);
router.route('/delivered/:id').put(isAuth, isAdmin, orderController.updateOrderToDelivered);
router.route('/all').get(isAuth, isAdmin, orderController.getOrders);

export default router;
