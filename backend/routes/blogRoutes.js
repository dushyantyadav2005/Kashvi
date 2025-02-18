import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogsByCategory,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// POST /api/blogs (Create a blog)
router.post("/", asyncHandler(createBlog));

// GET /api/blogs (Get all blogs)
router.get("/", asyncHandler(getAllBlogs));

// GET /api/blogs/category/:category (Get blogs by category)
router.get("/category/:category", asyncHandler(getBlogsByCategory));

// GET /api/blogs/:id (Get a single blog by ID)
router.get("/:id", asyncHandler(getBlogById));

// PUT /api/blogs/:id (Update a blog)
router.put("/:id", asyncHandler(updateBlog));

// DELETE /api/blogs/:id (Delete a blog)
router.delete("/:id", asyncHandler(deleteBlog));

export default router;