#!/bin/bash
echo "Stopping development servers..."
[ -f .frontend.pid ] && { echo "Stopping frontend..."; kill $(cat .frontend.pid) 2>/dev/null; }
[ -f .backend.pid ] && { echo "Stopping backend..."; kill $(cat .backend.pid) 2>/dev/null; }
rm -f .frontend.pid .backend.pid
echo "All servers stopped"
