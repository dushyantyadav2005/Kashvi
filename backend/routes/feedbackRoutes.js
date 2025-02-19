import express from "express";
import { submitFeedback, getAllFeedbacks } from "../controllers/feedbackController.js";
const router = express.Router();

// POST route for submitting feedback
router.post('/', submitFeedback);
// GET route for retrieving all feedbacks
router.get('/', getAllFeedbacks);

export default router;