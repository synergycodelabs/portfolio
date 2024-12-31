# Repository Rename Checklist

## Pre-Rename Tasks

1. **Document Current Configuration**
   - Current repo name: `portfolio`
   - Current GitHub Pages URL: `https://synergycodelabs.github.io/portfolio/`
   - Current API URL: `https://api.synergycodelabs.com`

2. **Backup Important Files**
   ```bash
   # Create a backup branch
   git checkout -b backup-main
   git push origin backup-main
   ```

## Files to Update

### Backend (server/)

1. **Environment Configuration**
   - File: `server/config/environment.js`
   - Update CORS allowed origins:
     ```javascript
     ALLOWED_ORIGINS: process.env.NODE_ENV === 'production'
         ? [
             'https://synergycodelabs.github.io/new-name',
             'https://api.synergycodelabs.com'
           ]
         : ['http://localhost:3001', 'http://localhost:3002'],
     ```

2. **Nginx Configuration**
   - File: `nginx/conf/default.conf`
   - Update CORS headers if they reference the old repository name

### Frontend

1. **Vite Configuration**
   - File: `vite.config.js`
   - Update base URL if it references the repository name
   ```javascript
   base: '/new-name/'
   ```

2. **Package.json**
   - Update repository name in:
     - name field
     - homepage field
     - repository field

3. **API Client Configuration**
   - Update any hardcoded API URLs that include the repository name
   - Check for repository name in environment variables

4. **GitHub Pages Configuration**
   - Update any workflow files in `.github/workflows/`
   - Verify the deployment settings

## Rename Process

1. **Pre-Rename Verification**
   ```bash
   # Verify all changes are committed
   git status
   
   # Create a new backup branch
   git checkout -b pre-rename-backup
   git push origin pre-rename-backup
   ```

2. **Rename Repository**
   - Go to GitHub repository settings
   - Under "Repository name", enter the new name
   - Click "Rename"

3. **Update Local Repository**
   ```bash
   # Update remote URL
   git remote set-url origin https://github.com/synergycodelabs/new-name.git
   
   # Verify new remote URL
   git remote -v
   ```

4. **Deploy Updates**
   ```bash
   # Deploy API changes
   docker-compose down
   docker-compose up --build -d
   
   # Deploy frontend changes
   npm run deploy
   ```

## Post-Rename Verification

1. **Check GitHub Pages**
   - Verify new URL: `https://synergycodelabs.github.io/new-name/`
   - Test navigation and routing
   - Verify assets load correctly

2. **Check API Integration**
   - Test API endpoints through new GitHub Pages URL
   - Verify CORS is working
   - Check WebSocket connections if any

3. **Monitor for Issues**
   - Check GitHub Actions for successful deployments
   - Monitor API logs for any CORS errors
   - Test all major functionality

## Rollback Plan

If issues occur:

1. **Revert Repository Name**
   - Rename repository back to original name on GitHub
   - Update remote URL in local repository

2. **Restore Configuration**
   ```bash
   # Restore from backup branch
   git checkout backup-main
   
   # Force push if necessary (be careful!)
   git push --force origin main
   ```

3. **Redeploy Services**
   ```bash
   # Rebuild and restart services
   docker-compose down
   docker-compose up --build -d
   ```

## Post-Migration Tasks

1. **Update Documentation**
   - Update README.md with new repository name
   - Update any documentation referencing the old repository name
   - Update any external links or references

2. **Notify Stakeholders**
   - Inform team members of the new repository URL
   - Update any external documentation or references
   - Update bookmarks and CI/CD configurations

3. **Cleanup**
   ```bash
   # After confirming everything works, remove backup branch
   git branch -d backup-main
   git push origin --delete backup-main
   ```

## Notes

- Plan the rename during low-traffic periods
- Have all team members available during the migration
- Keep the backup branch for at least a week after successful migration
- Monitor logs and error reports closely after the rename
