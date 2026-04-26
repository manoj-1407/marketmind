# push_to_github.ps1
# Run this script after creating the 'marketmind' repository on GitHub.

Write-Host "🚀 Preparing to push MarketMind to GitHub..." -ForegroundColor Cyan

# 1. Initialize Git if not already done
if (!(Test-Path .git)) {
    git init
    Write-Host "✅ Initialized empty Git repository." -ForegroundColor Green
}

# 2. Check for .gitignore, create if missing to avoid committing huge folders
if (!(Test-Path .gitignore)) {
    Set-Content -Path .gitignore -Value "venv/`n__pycache__/`n*.pyc`n.env`nfrontend/node_modules/`nfrontend/.next/`nmarketmind.db"
    Write-Host "✅ Created .gitignore to protect secrets and ignore large files." -ForegroundColor Green
}

# 3. Add all files
git add .
Write-Host "✅ Added all files to staging." -ForegroundColor Green

# 4. Commit
git commit -m "Initial commit: MarketMind 3D Immersive Release v1.0"
Write-Host "✅ Committed files." -ForegroundColor Green

# 5. Prompt for GitHub Username to construct URL
$username = Read-Host "Enter your GitHub Username (e.g. vharr)"
$repoUrl = "https://github.com/$username/marketmind.git"

# 6. Add remote and push
git remote add origin $repoUrl
git branch -M main
Write-Host "Pushing to $repoUrl ..." -ForegroundColor Cyan
git push -u origin main

Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "You can now follow the Deployment Guide in README.md to deploy your frontend to Vercel and backend to Render." -ForegroundColor Yellow
