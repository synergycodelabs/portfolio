# WSL2 Port Forwarding Setup
Last Updated: 2025-01-04

## Configuration Overview

### Network Setup
- Windows Host IP: 192.168.1.152
- WSL2 IP: 192.168.1.164
- Domain: api.synergycodelabs.com

### Port Forwarding
```
Listen (Windows)    â†’    Forward (WSL2)
192.168.1.152:80   â†’    192.168.1.164:80
192.168.1.152:443  â†’    192.168.1.164:443
192.168.1.152:3002 â†’    192.168.1.164:3002
```

### Automatic Configuration
- Task Name: WSL2PortForwarding
- Trigger: System startup (30s delay)
- Runs as: SYSTEM account
- Location: `server\scripts\wsl-startup.ps1`

## Verification Scripts
1. Domain Check: `server\tests\verify-domain.ps1`
2. Task Status: `server\tests\verify-startup-task.ps1`
3. Network Status: `server\tests\verify-wsl-network.ps1`

## Testing Endpoints
- Health Check: http://api.synergycodelabs.com/health
- API Status: http://api.synergycodelabs.com/api/status

## Future Considerations
1. HTTPS Setup (when needed)
2. Additional security measures
3. Monitoring and logging

## Troubleshooting
If services become unavailable:
1. Check WSL2 status: `wsl --status`
2. Verify port forwarding: `netsh interface portproxy show all`
3. Run verification script: `.\server\tests\verify-domain.ps1`