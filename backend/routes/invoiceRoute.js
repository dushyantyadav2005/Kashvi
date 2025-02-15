import express from "express";
import { generateInvoice } from "../controllers/InvoiceController.js";
const router = express.Router();


router.route("/").post(generateInvoice);
export default router;

