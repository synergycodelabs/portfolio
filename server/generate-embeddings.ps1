# Load API key from environment variable
if (-not $env:OPENAI_API_KEY) {
   Write-Error "OPENAI_API_KEY environment variable not set"
   exit 1
}
node scripts/generate-embeddings.js
