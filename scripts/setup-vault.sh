#!/bin/bash

# NEARWEEK Intelligence Platform - Vault Setup Script
set -e

echo "🔐 Setting up HashiCorp Vault for NEARWEEK Intelligence Platform..."

# Install Vault
install_vault() {
    echo "📦 Installing HashiCorp Vault..."
    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
    sudo apt-get update && sudo apt-get install vault
    echo "✅ Vault installed successfully"
}

# Setup production secrets (placeholders)
setup_prod_secrets() {
    echo "🏭 Setting up production environment secrets..."
    
    vault kv put secret/nearweek/production \
        github_token="REPLACE_WITH_REAL_GITHUB_TOKEN" \
        telegram_bot_token="REPLACE_WITH_REAL_TELEGRAM_TOKEN" \
        zapier_webhook="REPLACE_WITH_REAL_ZAPIER_WEBHOOK" \
        gemini_api_key="REPLACE_WITH_REAL_GEMINI_KEY"
    
    echo "⚠️  Production secrets contain placeholders - replace with real values"
    echo "✅ Production secret structure configured"
}

# Create monitoring script
create_monitoring() {
    echo "📊 Creating Vault monitoring script..."
    
    cat > vault-monitor.sh << 'MONITOR_EOF'
#!/bin/bash
export VAULT_ADDR='http://127.0.0.1:8200'
vault_status=$(vault status -format=json 2>/dev/null)
if [ $? -eq 0 ]; then
    sealed=$(echo $vault_status | jq -r '.sealed')
    if [ "$sealed" = "false" ]; then
        echo "✅ Vault is healthy and unsealed"
        exit 0
    else
        echo "⚠️  Vault is sealed"
        exit 1
    fi
else
    echo "❌ Vault is not responding"
    exit 2
fi
MONITOR_EOF

    chmod +x vault-monitor.sh
    echo "✅ Vault monitoring script created"
}

# Main execution
main() {
    if command -v vault &> /dev/null; then
        echo "ℹ️  Vault is already installed"
    else
        install_vault
    fi
    
    setup_prod_secrets
    create_monitoring
    
    echo "🎉 Vault setup completed successfully!"
    echo "🔗 Vault UI: http://127.0.0.1:8200"
}

main "$@"
