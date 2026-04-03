#!/bin/bash

# Voicy Web Deployment Script
# This script initializes a git repo in the web folder and prepares it for GitHub Pages.

# 1. Initialize Git
git init
git add .
git commit -m "Initial Solarpunk & Night Sky Portal"

# 2. Instructions for the user
echo "--------------------------------------------------------"
echo "VOICY DEPLOYMENT READY"
echo "--------------------------------------------------------"
echo "Next Steps:"
echo "1. Go to GitHub and create a NEW PUBLIC REPOSITORY named: voicydroid"
echo "2. Run these commands to push your portal:"
echo "   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/voicydroid.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Go to Repository Settings > Pages:"
echo "   - Set Source to 'Deploy from a branch'"
echo "   - Ensure 'main' branch and '/ (root)' folder are selected."
echo "   - Under 'Custom domain', ensure 'voicydroid.com' is listed (CNAME file is already included)."
echo "   - Check 'Enforce HTTPS'."
echo "--------------------------------------------------------"
