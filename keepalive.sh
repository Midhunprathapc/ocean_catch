#!/bin/bash
cd /home/z/my-project
node node_modules/.bin/next dev -p 3000 &
NEXT_PID=$!
echo "Next.js PID: $NEXT_PID"

# Keep the script running
while kill -0 $NEXT_PID 2>/dev/null; do
    sleep 5
done

echo "Next.js process died, restarting..."
exec "$0"
