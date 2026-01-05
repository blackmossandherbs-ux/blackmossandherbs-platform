#!/bin/bash

# MULTI-PROJECT SERVER MANAGER
# Prevents projects from conflicting with each other
# Each project gets its own port, containers, and Nginx config

set -e

# Project Configuration
PROJECT_NAME="blackmossherbs"
PROJECT_PORT="3005"
DB_PORT="5435"
DOMAIN="blackmossandherbs.com"
PROJECT_DIR="/var/www/blackmossandherbs-platform"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Show menu
show_menu() {
    clear
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         MULTI-PROJECT SERVER MANAGER                       ║"
    echo "║         Black Moss & Herbs - Project Isolation             ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Current Project: $PROJECT_NAME"
    echo "Port: $PROJECT_PORT | DB Port: $DB_PORT"
    echo ""
    echo "1. Deploy This Project (Black Moss)"
    echo "2. Start This Project"
    echo "3. Stop This Project"
    echo "4. Restart This Project"
    echo "5. View Logs"
    echo "6. Check Status"
    echo "7. List ALL Projects on Server"
    echo "8. Stop OTHER Projects (Keep Black Moss Running)"
    echo "9. Configure Nginx for This Project"
    echo "10. Full System Status"
    echo "0. Exit"
    echo ""
    read -p "Select option: " choice
}

# Deploy project
deploy_project() {
    print_status "Deploying $PROJECT_NAME..."
    
    cd "$PROJECT_DIR" || exit 1
    
    print_status "Pulling latest code..."
    git pull origin main || git pull origin $(git branch --show-current)
    
    print_status "Installing dependencies..."
    npm install --production
    
    print_status "Building application..."
    npm run build
    
    print_status "Setting up database..."
    npx prisma generate
    npx prisma db push --accept-data-loss || true
    
    print_status "Starting containers..."
    docker-compose down
    docker-compose up -d --build
    
    sleep 10
    
    print_success "Deployment complete!"
    check_status
}

# Start project
start_project() {
    print_status "Starting $PROJECT_NAME..."
    cd "$PROJECT_DIR" || exit 1
    docker-compose up -d
    sleep 5
    print_success "Started!"
    check_status
}

# Stop project
stop_project() {
    print_status "Stopping $PROJECT_NAME..."
    cd "$PROJECT_DIR" || exit 1
    docker-compose down
    print_success "Stopped!"
}

# Restart project
restart_project() {
    print_status "Restarting $PROJECT_NAME..."
    cd "$PROJECT_DIR" || exit 1
    docker-compose restart
    sleep 5
    print_success "Restarted!"
    check_status
}

# View logs
view_logs() {
    print_status "Showing logs for $PROJECT_NAME..."
    cd "$PROJECT_DIR" || exit 1
    docker-compose logs -f --tail=100
}

# Check status
check_status() {
    echo ""
    print_status "Checking $PROJECT_NAME status..."
    echo ""
    
    # Check Docker containers
    echo "Docker Containers:"
    docker ps --filter "name=$PROJECT_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || true
    
    echo ""
    
    # Check if app is responding
    if curl -s -f http://localhost:$PROJECT_PORT > /dev/null 2>&1; then
        print_success "App is responding on port $PROJECT_PORT"
    else
        print_error "App is NOT responding on port $PROJECT_PORT"
    fi
    
    echo ""
}

# List all projects
list_all_projects() {
    echo ""
    print_status "ALL Docker containers on this server:"
    echo ""
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"
    echo ""
    
    print_status "Port usage:"
    echo ""
    netstat -tlnp 2>/dev/null | grep -E ":(3[0-9]{3}|80|443)" || ss -tlnp | grep -E ":(3[0-9]{3}|80|443)"
    echo ""
}

# Stop other projects
stop_other_projects() {
    print_warning "This will stop ALL containers EXCEPT $PROJECT_NAME"
    read -p "Are you sure? (y/n): " confirm
    
    if [ "$confirm" = "y" ]; then
        print_status "Stopping other projects..."
        
        # Get all container IDs except this project
        OTHER_CONTAINERS=$(docker ps -q --filter "name=^(?!$PROJECT_NAME)" | grep -v "^$" || true)
        
        if [ -n "$OTHER_CONTAINERS" ]; then
            echo "$OTHER_CONTAINERS" | xargs docker stop
            print_success "Stopped other projects"
        else
            print_status "No other projects running"
        fi
        
        echo ""
        list_all_projects
    fi
}

# Configure Nginx
configure_nginx() {
    print_status "Configuring Nginx for $PROJECT_NAME..."
    
    cd "$PROJECT_DIR" || exit 1
    
    # Backup existing configs
    mkdir -p /etc/nginx/sites-backup
    cp /etc/nginx/sites-enabled/* /etc/nginx/sites-backup/ 2>/dev/null || true
    
    # Remove conflicting default configs
    rm -f /etc/nginx/sites-enabled/default
    
    # Copy project config
    if [ -f "config/blackmoss.nginx.conf" ]; then
        cp config/blackmoss.nginx.conf /etc/nginx/sites-available/$DOMAIN
        
        # Enable this project's config
        ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
        
        print_success "Nginx config installed"
    else
        print_error "Config file not found!"
    fi
    
    # Test nginx
    print_status "Testing Nginx configuration..."
    if nginx -t 2>&1; then
        print_success "Nginx config is valid"
        
        print_status "Restarting Nginx..."
        systemctl restart nginx
        print_success "Nginx restarted"
    else
        print_error "Nginx config has errors!"
        print_warning "Restoring backup..."
        cp /etc/nginx/sites-backup/* /etc/nginx/sites-enabled/ 2>/dev/null || true
        systemctl reload nginx
    fi
}

# Full system status
full_system_status() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║              FULL SYSTEM STATUS                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_status "All Docker Containers:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    print_status "Disk Usage:"
    df -h / /var/lib/docker
    echo ""
    
    print_status "Memory Usage:"
    free -h
    echo ""
    
    print_status "Nginx Status:"
    systemctl status nginx --no-pager -l | head -10
    echo ""
    
    print_status "Active Nginx Sites:"
    ls -la /etc/nginx/sites-enabled/
    echo ""
    
    print_status "Port Bindings (3000-4000 range):"
    netstat -tlnp 2>/dev/null | grep -E ":(3[0-9]{3}|4[0-9]{3})" | head -20 || ss -tlnp | grep -E ":(3[0-9]{3}|4[0-9]{3})" | head -20
    echo ""
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1)
            deploy_project
            read -p "Press Enter to continue..."
            ;;
        2)
            start_project
            read -p "Press Enter to continue..."
            ;;
        3)
            stop_project
            read -p "Press Enter to continue..."
            ;;
        4)
            restart_project
            read -p "Press Enter to continue..."
            ;;
        5)
            view_logs
            ;;
        6)
            check_status
            read -p "Press Enter to continue..."
            ;;
        7)
            list_all_projects
            read -p "Press Enter to continue..."
            ;;
        8)
            stop_other_projects
            read -p "Press Enter to continue..."
            ;;
        9)
            configure_nginx
            read -p "Press Enter to continue..."
            ;;
        10)
            full_system_status
            read -p "Press Enter to continue..."
            ;;
        0)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option"
            sleep 2
            ;;
    esac
done
