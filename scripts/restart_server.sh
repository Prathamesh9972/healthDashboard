#!/bin/bash

# Optional: clear old content
rm -rf /var/www/html/react-app/*

# Deploy new build (already copied by CodeDeploy)
echo "Deployment completed"

# Optional: restart nginx if you're serving via nginx
# systemctl restart nginx
