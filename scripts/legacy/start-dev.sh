#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p /home/masd/projects/portfolio/logs

# Kill existing processes first
echo "Cleaning up existing processes..."
pkill -f "vite"
pkill -f "server.js"
sleep 2

# Function to start a process and log its output
start_process() {
    local name=$1
    local cmd=$2
    local log_file=$3
    local working_dir=$4
    
    cd "$working_dir"
    echo "Starting $name..."
    $cmd > "$log_file" 2>&1 &
    echo $! > ".$name.pid"
    sleep 2
    
    # Check if process is running
    if ps -p $(cat ".$name.pid") > /dev/null; then
        echo "✓ $name started successfully"
    else
        echo "✗ Failed to start $name"
        return 1
    fi
}

# Start frontend
FRONTEND_LOG="/home/masd/projects/portfolio/logs/frontend.log"
start_process "frontend" "npm run dev" "$FRONTEND_LOG" "/home/masd/projects/portfolio"

# Start backend
BACKEND_LOG="/home/masd/projects/portfolio/logs/backend.log"
start_process "backend" "node server.js" "$BACKEND_LOG" "/home/masd/projects/portfolio/server"

# Show status
echo -e "\n=== Development Environment Status ==="
echo "► Frontend (Vite): http://localhost:3001/portfolio/"
echo "► Backend (Node): http://localhost:3003"
echo "► Nginx: http://localhost/portfolio/"

echo -e "\nLog files:"
echo "► Frontend: $FRONTEND_LOG"
echo "► Backend: $BACKEND_LOG"

# Create stop script
cat > /home/masd/projects/portfolio/stop-dev.sh << 'EOF'
#!/bin/bash
echo "Stopping development servers..."
[ -f .frontend.pid ] && { echo "Stopping frontend..."; kill $(cat .frontend.pid) 2>/dev/null; }
[ -f .backend.pid ] && { echo "Stopping backend..."; kill $(cat .backend.pid) 2>/dev/null; }
rm -f .frontend.pid .backend.pid
echo "All servers stopped"
EOF

chmod +x /home/masd/projects/portfolio/stop-dev.sh

# Show live logs with labels
echo -e "\nShowing live logs (Ctrl+C to stop)..."
echo "----------------------------------------"
tail -f \
    <(while read line; do echo -e "\e[32m[Frontend]\e[0m $line"; done < "$FRONTEND_LOG") \
    <(while read line; do echo -e "\e[36m[Backend]\e[0m $line"; done < "$BACKEND_LOG") \
    2>/dev/null

# Cleanup on exit
trap '/home/masd/projects/portfolio/stop-dev.sh' INT TERM