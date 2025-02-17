// routes/feedbackRoutes.js
import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";
const router = express.Router();

// POST route for submitting feedback
router.post('/', submitFeedback);

export default router