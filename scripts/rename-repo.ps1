# Repository Rename Automation Script
param(
    [Parameter(Mandatory=$true)]
    [string]$NewRepoName,
    
    [Parameter(Mandatory=$false)]
    [string]$OldRepoName = "portfolio",
    
    [Parameter(Mandatory=$false)]
    [string]$BackupBranch = "pre-rename-backup"
)

# Function to log messages
function Write-Log {
    param($Message)
    Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): $Message"
}

# Function to create backup
function Create-Backup {
    Write-Log "Creating backup branch '$BackupBranch'..."
    git checkout -b $BackupBranch
    git push origin $BackupBranch
    git checkout main
}

# Function to update file content
function Update-FileContent {
    param($FilePath, $OldValue, $NewValue)
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match [regex]::Escape($OldValue)) {
            $newContent = $content -replace [regex]::Escape($OldValue), $NewValue
            Set-Content -Path $FilePath -Value $newContent
            Write-Log "Updated $FilePath"
        }
    }
}

try {
    # 1. Create backup
    Create-Backup

    # 2. Update vite.config.js
    Write-Log "Updating vite.config.js..."
    Update-FileContent "vite.config.js" "base: '/portfolio/'" "base: '/$NewRepoName/'"

    # 3. Update package.json
    Write-Log "Updating package.json..."
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $packageJson.name = $NewRepoName
    $packageJson.homepage = "https://synergycodelabs.github.io/$NewRepoName"
    $packageJson | ConvertTo-Json -Depth 100 | Set-Content "package.json"

    # 4. Update GitHub workflow files
    Get-ChildItem -Path ".github/workflows" -Filter "*.yml" | ForEach-Object {
        Write-Log "Updating workflow file: $($_.Name)..."
        Update-FileContent $_.FullName "/portfolio/" "/$NewRepoName/"
    }

    # 5. Update frontend API configuration
    Write-Log "Updating frontend API configuration..."
    Update-FileContent "src/config/api.js" "portfolio" $NewRepoName

    # 6. Update Docker-related files
    Write-Log "Updating Docker configuration..."
    Update-FileContent "docker-compose.yml" "portfolio-" "$NewRepoName-"

    # 7. Update nginx configuration
    Get-ChildItem -Path "nginx/conf" -Filter "*.conf" | ForEach-Object {
        Write-Log "Updating nginx config: $($_.Name)..."
        Update-FileContent $_.FullName "/portfolio/" "/$NewRepoName/"
    }

    Write-Log "Local file updates completed successfully!"
    Write-Log ""
    Write-Log "Next steps:"
    Write-Log "1. Review the changes using 'git status' and 'git diff'"
    Write-Log "2. Commit the changes:"
    Write-Log "   git add ."
    Write-Log "   git commit -m 'refactor: update repository name to $NewRepoName'"
    Write-Log ""
    Write-Log "3. On GitHub:"
    Write-Log "   - Go to repository settings"
    Write-Log "   - Rename the repository to '$NewRepoName'"
    Write-Log ""
    Write-Log "4. Update local git remote:"
    Write-Log "   git remote set-url origin https://github.com/synergycodelabs/$NewRepoName.git"
    Write-Log ""
    Write-Log "5. Push changes:"
    Write-Log "   git push origin main"
    Write-Log ""
    Write-Log "6. Rebuild and redeploy:"
    Write-Log "   docker-compose down"
    Write-Log "   docker-compose up --build -d"
    Write-Log ""
    Write-Log "7. Verify:"
    Write-Log "   - GitHub Pages: https://synergycodelabs.github.io/$NewRepoName"
    Write-Log "   - API: https://api.synergycodelabs.com"
    Write-Log "   - All functionality working correctly"

} catch {
    Write-Log "Error occurred: $_"
    Write-Log "Rolling back changes..."
    git reset --hard
    git checkout main
    exit 1
}
