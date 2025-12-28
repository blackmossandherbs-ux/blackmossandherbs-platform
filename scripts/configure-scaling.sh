#!/bin/bash
set -e

echo "⚙️  BlackMoss & Herbs - Scaling Configuration"
echo "=============================================="
echo ""

# Check if .env.scale exists
if [ ! -f .env.scale ]; then
    echo "📝 Creating .env.scale from template..."
    cp .env.scale.example .env.scale
    echo "✅ Created .env.scale"
    echo "   Please edit it with your configuration"
    echo ""
fi

# Source the scaling config
if [ -f .env.scale ]; then
    set -a
    source .env.scale
    set +a
fi

echo "🔧 Configuration Summary:"
echo "  Instance ID: ${INSTANCE_ID:-not set}"
echo "  CDN Enabled: ${CDN_ENABLED:-false}"
echo "  Read Replicas: ${READ_REPLICA_ENABLED:-false}"
echo "  Auto-scaling: ${AUTO_SCALE_ENABLED:-false}"
echo "  Monitoring: ${PROMETHEUS_ENABLED:-false}"
echo ""

# Menu
echo "What would you like to configure?"
echo "  1) CDN (Cloudflare)"
echo "  2) Read Replicas"
echo "  3) Auto-scaling (Kubernetes)"
echo "  4) Monitoring Stack"
echo "  5) All of the above"
echo "  6) Exit"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo ""
        echo "🌐 Configuring CDN..."
        if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
            echo "⚠️  Cloudflare credentials not set in .env.scale"
            echo "   Please set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID"
        else
            ./config/cloudflare-setup.sh
        fi
        ;;
    2)
        echo ""
        echo "🗄️  Setting up Read Replicas..."
        ./scripts/setup-read-replicas.sh
        ;;
    3)
        echo ""
        echo "📈 Configuring Auto-scaling..."
        echo "   Kubernetes manifests are in kubernetes/"
        echo "   Apply with: kubectl apply -f kubernetes/"
        echo ""
        echo "   Or use Docker Swarm:"
        echo "   docker stack deploy -c docker-compose.scale.yml blackmoss"
        ;;
    4)
        echo ""
        echo "📊 Starting Monitoring Stack..."
        docker-compose -f docker-compose.scale.yml up -d prometheus grafana loki promtail
        echo ""
        echo "✅ Monitoring stack started"
        echo "   Prometheus: http://localhost:9090"
        echo "   Grafana: http://localhost:3001 (admin/${GRAFANA_PASSWORD:-admin})"
        ;;
    5)
        echo ""
        echo "🚀 Configuring everything..."
        echo ""
        
        # CDN
        if [ "$CDN_ENABLED" = "true" ]; then
            echo "1/4 Configuring CDN..."
            if [ -n "$CLOUDFLARE_API_TOKEN" ] && [ -n "$CLOUDFLARE_ZONE_ID" ]; then
                ./config/cloudflare-setup.sh
            else
                echo "   ⚠️  Skipping CDN (credentials not set)"
            fi
        fi
        
        # Read Replicas
        if [ "$READ_REPLICA_ENABLED" = "true" ]; then
            echo ""
            echo "2/4 Setting up Read Replicas..."
            ./scripts/setup-read-replicas.sh
        fi
        
        # Monitoring
        if [ "$PROMETHEUS_ENABLED" = "true" ]; then
            echo ""
            echo "3/4 Starting Monitoring Stack..."
            docker-compose -f docker-compose.scale.yml up -d prometheus grafana loki promtail
        fi
        
        # Auto-scaling info
        echo ""
        echo "4/4 Auto-scaling Configuration:"
        echo "   Kubernetes: kubectl apply -f kubernetes/"
        echo "   Docker Swarm: docker stack deploy -c docker-compose.scale.yml blackmoss"
        echo ""
        echo "✅ Configuration complete!"
        ;;
    6)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📚 Documentation:"
echo "  - Scaling Guide: docs/SCALING.md"
echo "  - Configuration: .env.scale"
echo ""
