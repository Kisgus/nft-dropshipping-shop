const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Order schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerEmail: { type: String, required: true },
  customerAddress: String,
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number,
    variant: String
  }],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  printfulOrderId: String,
  nftTokenId: String,
  nftMinted: { type: Boolean, default: false },
  shippingAddress: {
    name: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = {
      orderId: `NFT-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Order retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order'
    });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const updateData = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Orders retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders'
    });
  }
});

// Update NFT info for order
router.patch('/:orderId/nft', async (req, res) => {
  try {
    const { nftTokenId, nftMinted } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      {
        nftTokenId,
        nftMinted: nftMinted || false,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order,
      message: 'NFT information updated successfully'
    });
  } catch (error) {
    console.error('NFT update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update NFT information'
    });
  }
});

module.exports = router;