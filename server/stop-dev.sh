#!/bin/bash
echo "Stopping development servers..."
[ -f .frontend.pid ] && kill $(cat .frontend.pid) 2>/dev/null
[ -f .backend.pid ] && kill $(cat .backend.pid) 2>/dev/null
rm -f .frontend.pid .backend.pid
echo "Servers stopped"
