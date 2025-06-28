#!/bin/bash

# NFT Dropshipping Shop - Quick Start Commands
# This file contains all the essential commands for setup and operation

echo "NFT Dropshipping Shop - Command Reference"
echo "========================================"

# Initial setup
setup() {
    echo "Initial Setup:"
    echo "git clone https://github.com/Kisgus/nft-dropshipping-shop.git"
    echo "cd nft-dropshipping-shop"
    echo "chmod +x scripts/setup.sh"
    echo "./scripts/setup.sh"
    echo "cp .env.example .env"
    echo "# Edit .env with your configuration"
}

# Development commands
development() {
    echo "Development Commands:"
    echo "npm install"
    echo "npm run dev                    # Start development server"
    echo "node scripts/test-integration.js  # Run integration tests"
    echo "node scripts/check-contract-status.js  # Check blockchain status"
}

# Smart contract deployment
contract() {
    echo "Smart Contract Commands:"
    echo "npx hardhat compile           # Compile contracts"
    echo "node scripts/deploy-contract.js  # Deploy to blockchain"
    echo "node scripts/check-contract-status.js  # Verify deployment"
}

# Production deployment
production() {
    echo "Production Deployment:"
    echo "chmod +x scripts/production-deploy.sh"
    echo "sudo ./scripts/production-deploy.sh --domain your-domain.com"
    echo "# OR with Docker:"
    echo "docker-compose up -d"
}

# API testing
api_testing() {
    echo "API Testing Commands:"
    echo "curl http://localhost:3000/health"
    echo "curl http://localhost:3000/api/printful/products"
    echo "# Test NFT metadata generation:"
    echo 'curl -X POST http://localhost:3000/api/nft/metadata -H "Content-Type: application/json" -d '"'"'{"productId":"123","productName":"Test","imageUrl":"https://example.com/img.jpg","customerAddress":"0x...","orderId":"TEST001"}'"'"''
}

# Monitoring commands
monitoring() {
    echo "Monitoring Commands:"
    echo "pm2 status                    # Check PM2 processes"
    echo "pm2 logs nft-dropshipping    # View application logs"
    echo "docker-compose logs -f       # View Docker logs"
    echo "tail -f logs/app.log         # View application logs"
    echo "mongo nft-dropshipping --eval 'db.stats()'  # Database status"
}

# NEARWEEK Intelligence Integration
nearweek_integration() {
    echo "NEARWEEK Intelligence Integration:"
    echo "curl -o integration-script.sh https://gist.githubusercontent.com/Kisgus/fed8bcee6139928f3dd7a5a3df68cd7e/raw/nearweek-intelligence-integration.sh"
    echo "chmod +x integration-script.sh"
    echo "./integration-script.sh       # Execute NEARWEEK intelligence platform setup"
}

# Maintenance commands
maintenance() {
    echo "Maintenance Commands:"
    echo "npm audit                     # Security audit"
    echo "npm update                    # Update dependencies"
    echo "mongodump --uri=\"\$MONGO_URI\" --out=backup_\$(date +%Y%m%d)  # Database backup"
    echo "pm2 restart nft-dropshipping # Restart application"
    echo "docker-compose restart       # Restart Docker services"
}

# Show all commands
show_all() {
    echo ""
    setup
    echo ""
    development
    echo ""
    contract
    echo ""
    production
    echo ""
    api_testing
    echo ""
    monitoring
    echo ""
    nearweek_integration
    echo ""
    maintenance
    echo ""
}

# Main execution
case "${1:-all}" in
    setup)
        setup
        ;;
    dev|development)
        development
        ;;
    contract)
        contract
        ;;
    prod|production)
        production
        ;;
    api|test)
        api_testing
        ;;
    monitor)
        monitoring
        ;;
    nearweek|intelligence)
        nearweek_integration
        ;;
    maintenance)
        maintenance
        ;;
    all|*)
        show_all
        ;;
esac
