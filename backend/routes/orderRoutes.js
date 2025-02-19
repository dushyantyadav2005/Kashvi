import express from "express";
import { createOrder, getMyOrders, getOrders } from "../controllers/orderController.js";
const router = express.Router();

router.post("/", createOrder);
router.get("/mine/:id", getMyOrders);
router.get("/:id/:user_id", getOrders)

export default router;