#!/bin/sh

# Start the first process
./zid &
ZID_PID=$!

# Start the second process
cd /web 
npm start &
WEB_PID=$!

# Naive check runs checks once a minute to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container exits with an error
# if it detects that either of the processes has exited.
# Otherwise it loops forever, waking up every 60 seconds

while sleep 60; do
  ps -fp $ZID_PID 
  ZID_PROCESS_STATUS=$?
  if [ $ZID_PROCESS_STATUS -ne 0 ]; then
    echo "ZID process has already exited."
    exit 1
  fi
  
  ps -fp $WEB_PID 
  WEB_PROCESS_STATUS=$?
  if [ $WEB_PROCESS_STATUS -ne 0 ]; then
    echo "WEB process has already exited."
    exit 1
  fi
done
