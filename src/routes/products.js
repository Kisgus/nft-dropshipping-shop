const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Product schema
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  basePrice: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  printfulProductId: String,
  images: [String],
  variants: [{
    variantId: String,
    name: String,
    price: Number,
    printfulVariantId: String
  }],
  nftEnabled: { type: Boolean, default: true },
  nftMetadata: {
    name: String,
    description: String,
    attributes: [{
      trait_type: String,
      value: String
    }]
  },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Get all products
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const active = req.query.active !== 'false';

    const filter = { active };
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Products retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve products'
    });
  }
});

// Get product by ID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Product retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve product'
    });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const productData = {
      productId: `PROD-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    });
  }
});

// Update product
router.put('/:productId', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

// Delete product
router.delete('/:productId', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      { active: false, updatedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { active: true });
    
    res.json({
      success: true,
      categories: categories.filter(cat => cat)
    });
  } catch (error) {
    console.error('Categories retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories'
    });
  }
});

module.exports = router;