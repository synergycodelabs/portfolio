# WSL2 Port Forwarding Task Scheduler Setup
# Purpose: Create a startup task to maintain WSL2 port forwarding
# Author: Angel
# Last Updated: 2025-01-04

#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$message)
    Write-Host "`n=== $message ===`n" -ForegroundColor Cyan
}

# Task configuration
$taskName = "WSL2PortForwarding"
$scriptPath = Join-Path $PSScriptRoot "wsl-startup.ps1"
$description = "Configures WSL2 port forwarding on system startup"

Write-Header "Creating Scheduled Task"

try {
    # Remove existing task if it exists
    $existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        Write-Host "Removing existing task..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    }

    # Create the action to run the script
    $action = New-ScheduledTaskAction `
        -Execute "PowerShell.exe" `
        -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""

    # Create trigger for system startup with a 30-second delay
    $trigger = New-ScheduledTaskTrigger -AtStartup
    $trigger.Delay = 'PT30S'  # 30-second delay

    # Set principal to run with highest privileges
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

    # Set settings
    $settings = New-ScheduledTaskSettingsSet `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
        -RestartCount 3 `
        -RestartInterval (New-TimeSpan -Minutes 1)

    # Register the task
    Register-ScheduledTask `
        -TaskName $taskName `
        -Action $action `
        -Trigger $trigger `
        -Principal $principal `
        -Settings $settings `
        -Description $description

    Write-Host "Task created successfully!" -ForegroundColor Green
    Write-Host "`nTask Details:"
    Get-ScheduledTask -TaskName $taskName | Format-List *

} catch {
    Write-Host "Error creating task: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}