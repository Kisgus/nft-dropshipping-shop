const express = require('express');
const { ethers } = require('ethers');
const axios = require('axios');
const crypto = require('crypto');
const router = express.Router();

// NFT Contract ABI (simplified)
const NFT_ABI = [
  "function mint(address to, uint256 tokenId, string memory uri) public",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

// Generate NFT metadata
router.post('/metadata', async (req, res) => {
  try {
    const {
      productId,
      productName,
      imageUrl,
      customerAddress,
      orderId
    } = req.body;

    // Generate unique token ID
    const tokenId = crypto.randomBytes(16).toString('hex');
    
    // Create NFT metadata following ERC-721 standard
    const metadata = {
      name: `${productName} #${tokenId.substring(0, 8)}`,
      description: `Exclusive NFT for ${productName} - Order #${orderId}`,
      image: imageUrl,
      external_url: `${process.env.FRONTEND_URL}/nft/${tokenId}`,
      attributes: [
        {
          trait_type: "Product ID",
          value: productId
        },
        {
          trait_type: "Order ID",
          value: orderId
        },
        {
          trait_type: "Owner",
          value: customerAddress
        },
        {
          trait_type: "Created",
          value: new Date().toISOString()
        }
      ],
      properties: {
        category: "Physical Product NFT",
        creator: "NFT Dropshipping Shop"
      }
    };

    // Store metadata (in production, upload to IPFS)
    const metadataUrl = `${process.env.BACKEND_URL}/api/nft/metadata/${tokenId}`;
    
    res.json({
      tokenId,
      metadata,
      metadataUrl,
      success: true
    });
  } catch (error) {
    console.error('NFT metadata generation error:', error);
    res.status(500).json({ error: 'Failed to generate NFT metadata' });
  }
});

// Get NFT metadata by token ID
router.get('/metadata/:tokenId', async (req, res) => {
  try {
    // In production, retrieve from database or IPFS
    const mockMetadata = {
      name: `NFT Product #${req.params.tokenId.substring(0, 8)}`,
      description: "Exclusive NFT for physical product",
      image: "https://via.placeholder.com/512x512",
      attributes: [
        {
          trait_type: "Token ID",
          value: req.params.tokenId
        }
      ]
    };
    
    res.json(mockMetadata);
  } catch (error) {
    console.error('NFT metadata retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve NFT metadata' });
  }
});

// Mint NFT
router.post('/mint', async (req, res) => {
  try {
    const {
      tokenId,
      recipientAddress,
      metadataUrl
    } = req.body;

    if (!process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
      return res.status(500).json({ error: 'Blockchain configuration missing' });
    }

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, NFT_ABI, wallet);

    // Mint NFT
    const transaction = await contract.mint(recipientAddress, tokenId, metadataUrl);
    const receipt = await transaction.wait();

    res.json({
      success: true,
      transactionHash: receipt.transactionHash,
      tokenId,
      recipient: recipientAddress
    });
  } catch (error) {
    console.error('NFT minting error:', error);
    res.status(500).json({ error: 'Failed to mint NFT' });
  }
});

// Check NFT ownership
router.get('/owner/:tokenId', async (req, res) => {
  try {
    if (!process.env.CONTRACT_ADDRESS) {
      return res.status(500).json({ error: 'Contract address not configured' });
    }

    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, NFT_ABI, provider);
    
    const owner = await contract.ownerOf(req.params.tokenId);
    
    res.json({
      tokenId: req.params.tokenId,
      owner
    });
  } catch (error) {
    console.error('NFT ownership check error:', error);
    res.status(500).json({ error: 'Failed to check NFT ownership' });
  }
});

module.exports = router;