import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import festivalsData from "../../festivals.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    console.log("Request Files: ", req.fields)
    const { countInStock, image, name, description, designNumber, category, quantity, festival } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !designNumber:
        return res.json({ error: "Design Number is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }
    let product = null;
    if (festival != "") {
      product = new Product({ ...req.fields });
    }
    else {
      product = new Product({ image, name, description, designNumber, category, quantity, countInStock });
    }
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, designNumber, category, quantity, festival } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !designNumber:
        return res.json({ error: "DesignNumber is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(20);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchFestivals = () => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11, so add 1
    // Calculate the next two months
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1; // Handle December overflow
    const nextNextMonth = nextMonth === 12 ? 1 : nextMonth + 1; // Handle December overflow

    console.log('Current Month:', currentMonth);
    console.log('Next Month:', nextMonth);
    console.log('Next Next Month:', nextNextMonth);

    // Filter festivals for the current month and the next two months
    const upcomingFestivals = festivalsData.filter(festival => {
      return (
        festival.month === currentMonth ||
        festival.month === nextMonth ||
        festival.month === nextNextMonth
      );
    });

    console.log('Upcoming festivals for the next two months:', upcomingFestivals);
    return upcomingFestivals;
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return [];
  }
};

const fetchFestiveProducts = asyncHandler(async (req, res) => {
  try {
    const upcomingFestivals = fetchFestivals(); // Remove await

    if (!upcomingFestivals || upcomingFestivals.length === 0) {
      return res.status(404).json({ message: 'No upcoming festivals found.' });
    }

    // Normalize festival names
    const festivalNames = upcomingFestivals.map(festival =>
      festival.name.trim().toLowerCase()
    );

    // Case-insensitive search
    const products = await Product.find({
      festival: {
        $in: festivalNames.map(name => new RegExp(name, 'i'))
      }
    });
    console.log(products);
    res.json({
      products,
      festivalNames
    });
  } catch (error) {
    console.error('Error fetching festive products:', error);
    res.status(400).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.designNumber = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  fetchFestiveProducts
};
