# WSL2 Port Forwarding Task Verification
# Purpose: Verify the startup task configuration
# Author: Angel
# Last Updated: 2025-01-04

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$message)
    Write-Host "`n=== $message ===`n" -ForegroundColor Cyan
}

Write-Header "Verifying WSL2 Port Forwarding Task"

# Check task existence and configuration
$taskName = "WSL2PortForwarding"
try {
    $task = Get-ScheduledTask -TaskName $taskName
    Write-Host "Task Status:" -ForegroundColor Yellow
    Write-Host "Name: $($task.TaskName)"
    Write-Host "State: $($task.State)"
    Write-Host "Author: $($task.Author)"
    Write-Host "Description: $($task.Description)"
    Write-Host "Last Run Time: $($task.LastRunTime)"
    Write-Host "Next Run Time: $($task.NextRunTime)"
    
    # Verify triggers
    Write-Host "`nTriggers:" -ForegroundColor Yellow
    $task.Triggers | Format-Table -AutoSize

    # Check port forwarding rules
    Write-Host "`nCurrent Port Forwarding Rules:" -ForegroundColor Yellow
    netsh interface portproxy show all
    
} catch {
    Write-Host "Error checking task: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}