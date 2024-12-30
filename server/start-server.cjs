const { spawn } = require('child_process');
const path = require('path');

const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
});

server.on('error', (err) => {
    console.error('Failed to start server:', err);
});

process.on('SIGINT', () => {
    server.kill('SIGINT');
    process.exit(0);
});