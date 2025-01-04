# Portfolio Chat API Test Script
# Purpose: Validate chat endpoint functionality and response quality
# Author: Angel
# Last Updated: 2025-01-04

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:3000/api/chat"

function Send-ChatMessage {
    param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]$message,
        
        [Parameter(Mandatory=$true)]
        [string]$testName,
        
        [Parameter(Mandatory=$false)]
        [string]$expectedSection
    )
    
    Write-Host "`n=== $testName ===" -ForegroundColor Blue
    Write-Host "Message: $message" -ForegroundColor Gray
    
    $body = @{
        message = $message
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod `
            -Uri $baseUrl `
            -Method Post `
            -ContentType "application/json" `
            -Body $body
            
        Write-Host "Response:" -ForegroundColor Green
        $response | ConvertTo-Json
        
        # Validate section if expected
        if ($expectedSection -and $response.section -ne $expectedSection) {
            Write-Host "Note: Expected section '$expectedSection', got '$($response.section)'" -ForegroundColor Yellow
        }
        
        return $response
    }
    catch {
        Write-Host "`nError Details:" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
        Write-Host "Message: $($_.Exception.Message)"
        return $null
    }
}

# Test Suite Configuration
$testCases = @(
    @{
        name = "Basic Introduction"
        message = "Hello, tell me about yourself"
        expectedSection = "Resume"
    },
    @{
        name = "Project Experience"
        message = "What projects have you worked on?"
        expectedSection = "Experience"
    },
    @{
        name = "Technical Skills"
        message = "What are your technical skills?"
        expectedSection = "About"
    },
    @{
        name = "Off-Topic Query"
        message = "What's your favorite programming language?"
    }
)

# Execute Test Suite
Write-Host "Starting Chat API Test Suite..." -ForegroundColor Cyan
Write-Host "Endpoint: $baseUrl" -ForegroundColor Gray

foreach ($test in $testCases) {
    $params = @{
        message = $test.message
        testName = $test.name
    }
    
    if ($test.expectedSection) {
        $params.expectedSection = $test.expectedSection
    }
    
    Send-ChatMessage @params
}

Write-Host "`nTest Suite Completed" -ForegroundColor Cyan