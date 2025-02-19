import Feedback from "../models/feedbackModel.js";

const submitFeedback = async (req, res) => {
    try {
        // Extract data from the request body
        const { name, email, message } = req.body;
        // Validate the input (basic validation)
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newFeedback = new Feedback({
            name,
            email,
            message
        });
        // Save the feedback to the database
        await newFeedback.save();
        // Send a success response
        res.status(201).json({ message: 'Feedback submitted successfully!', feedback: newFeedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add this new controller function
const getAllFeedbacks = async (req, res) => {
    try {
        // Retrieve all feedbacks sorted by creation date (newest first)
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        // Send the feedbacks as JSON response
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export { submitFeedback, getAllFeedbacks };