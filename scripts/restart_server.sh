#!/bin/bash
echo "Restarting server..."
pkill node || true
cd /home/ec2-user/myapp
nohup npm start > app.log 2>&1 &
