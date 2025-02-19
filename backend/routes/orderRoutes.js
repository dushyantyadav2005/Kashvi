import express from "express";
import { createOrder, getMyOrders, getOrders, getOrdersAdmin } from "../controllers/orderController.js";
const router = express.Router();

router.post("/", createOrder);
router.get("/mine/:id", getMyOrders);
router.get("/:id/:user_id", getOrders)
router.get("/getOrders", getOrdersAdmin)

export default router;