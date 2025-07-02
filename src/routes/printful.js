const express = require('express');
const axios = require('axios');
const router = express.Router();

const PRINTFUL_API_URL = 'https://api.printful.com';
const API_TOKEN = process.env.PRINTFUL_API_TOKEN;

// Printful API client
const printfulClient = axios.create({
  baseURL: PRINTFUL_API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const response = await printfulClient.get('/products');
    res.json(response.data);
  } catch (error) {
    console.error('Printful API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product details
router.get('/products/:id', async (req, res) => {
  try {
    const response = await printfulClient.get(`/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Printful API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Create order
router.post('/orders', async (req, res) => {
  try {
    const orderData = {
      recipient: req.body.recipient,
      items: req.body.items,
      external_id: req.body.external_id || Date.now().toString()
    };

    const response = await printfulClient.post('/orders', orderData);
    res.json(response.data);
  } catch (error) {
    console.error('Printful order creation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order status
router.get('/orders/:id', async (req, res) => {
  try {
    const response = await printfulClient.get(`/orders/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Printful API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
});

// Get mockup generation URL
router.post('/mockups', async (req, res) => {
  try {
    const mockupData = {
      product_id: req.body.product_id,
      variant_ids: req.body.variant_ids,
      files: req.body.files
    };

    const response = await printfulClient.post('/mockup-generator/create-task', mockupData);
    res.json(response.data);
  } catch (error) {
    console.error('Printful mockup error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate mockup' });
  }
});

// Get mockup task result
router.get('/mockups/:taskKey', async (req, res) => {
  try {
    const response = await printfulClient.get(`/mockup-generator/task?task_key=${req.params.taskKey}`);
    res.json(response.data);
  } catch (error) {
    console.error('Printful mockup task error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get mockup task result' });
  }
});

module.exports = router;