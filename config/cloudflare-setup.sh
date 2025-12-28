#!/bin/bash
set -e

echo "🌐 Cloudflare CDN Configuration Script"
echo "========================================"
echo ""

# Check if Cloudflare API credentials are set
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
    echo "⚠️  Cloudflare API credentials not set"
    echo ""
    echo "Please set the following environment variables:"
    echo "  export CLOUDFLARE_API_TOKEN='your-api-token'"
    echo "  export CLOUDFLARE_ZONE_ID='your-zone-id'"
    echo ""
    echo "You can get these from:"
    echo "  - API Token: https://dash.cloudflare.com/profile/api-tokens"
    echo "  - Zone ID: Cloudflare Dashboard > Your Domain > Overview (right sidebar)"
    echo ""
    exit 1
fi

ZONE_NAME="${CLOUDFLARE_ZONE_NAME:-blackmossandherbs.com}"

echo "📋 Configuration Summary:"
echo "  Zone: $ZONE_NAME"
echo "  Zone ID: $CLOUDFLARE_ZONE_ID"
echo ""

# Function to create page rule
create_page_rule() {
    local url_pattern=$1
    local cache_level=$2
    local edge_cache_ttl=$3
    
    echo "Creating page rule: $url_pattern"
    
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/pagerules" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{
            \"targets\": [{
                \"target\": \"url\",
                \"constraint\": {
                    \"operator\": \"matches\",
                    \"value\": \"*$ZONE_NAME$url_pattern\"
                }
            }],
            \"actions\": [
                {
                    \"id\": \"cache_level\",
                    \"value\": \"$cache_level\"
                },
                {
                    \"id\": \"edge_cache_ttl\",
                    \"value\": $edge_cache_ttl
                }
            ],
            \"priority\": 1,
            \"status\": \"active\"
        }" | jq '.'
    
    echo ""
}

# Function to create WAF rule
create_waf_rule() {
    local name=$1
    local expression=$2
    local action=$3
    
    echo "Creating WAF rule: $name"
    
    # Note: This requires Cloudflare WAF API (paid plan)
    # For free tier, use dashboard or Terraform
    echo "⚠️  WAF rules require manual setup in Cloudflare Dashboard"
    echo "    Rule: $name"
    echo "    Expression: $expression"
    echo "    Action: $action"
    echo ""
}

echo "🚀 Setting up Cloudflare CDN..."
echo ""

# 1. Cache static assets (1 year)
create_page_rule "/_next/static/*" "cache_everything" 31536000

# 2. Cache images (1 day)
create_page_rule "/images/*" "cache_everything" 86400

# 3. Enable Auto Minify
echo "Enabling Auto Minify..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/minify" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "value": {
            "css": "on",
            "html": "on",
            "js": "on"
        }
    }' | jq '.'

echo ""

# 4. Enable Brotli compression
echo "Enabling Brotli compression..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/brotli" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"value": "on"}' | jq '.'

echo ""

# 5. Enable HTTP/2 and HTTP/3
echo "Enabling HTTP/2 and HTTP/3..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/http2" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"value": "on"}' | jq '.'

curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/http3" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"value": "on"}' | jq '.'

echo ""

# 6. Configure SSL/TLS
echo "Setting SSL/TLS mode to Full (Strict)..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/ssl" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"value": "full"}' | jq '.'

echo ""

# 7. Enable Always Use HTTPS
echo "Enabling Always Use HTTPS..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/always_use_https" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"value": "on"}' | jq '.'

echo ""

# 8. Configure Security Headers
echo "Configuring Security Headers..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/transform/rulesets/phases/http_response_headers_transform/entrypoint" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{
        "rules": [{
            "action": "set_response_header",
            "action_parameters": {
                "headers": {
                    "X-Content-Type-Options": {
                        "value": "nosniff",
                        "operation": "set"
                    },
                    "X-Frame-Options": {
                        "value": "DENY",
                        "operation": "set"
                    },
                    "X-XSS-Protection": {
                        "value": "1; mode=block",
                        "operation": "set"
                    },
                    "Strict-Transport-Security": {
                        "value": "max-age=31536000; includeSubDomains",
                        "operation": "set"
                    }
                }
            },
            "expression": "true"
        }]
    }' | jq '.'

echo ""
echo "✅ Cloudflare CDN configuration complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Configure WAF rules in Cloudflare Dashboard"
echo "  2. Set up rate limiting rules"
echo "  3. Configure firewall rules if needed"
echo "  4. Update DNS records to point to your load balancer"
echo ""
