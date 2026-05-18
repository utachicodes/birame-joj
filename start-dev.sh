#!/bin/bash
set -e

echo "Starting JOJ backend on port 3001..."
cd "$(dirname "$0")/backend"
node server.js &
BACKEND_PID=$!

sleep 2

echo "Starting ngrok tunnel..."
ngrok http 3001 --log=stdout --log-format=json > /tmp/ngrok-joj.log &
NGROK_PID=$!

sleep 3

# Extract public URL from ngrok API
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try {
      const t = JSON.parse(d).tunnels.find(t=>t.proto==='https');
      console.log(t ? t.public_url : '');
    } catch { console.log(''); }
  });
")

if [ -z "$NGROK_URL" ]; then
  echo "Could not get ngrok URL. Check http://localhost:4040"
  kill $BACKEND_PID $NGROK_PID 2>/dev/null
  exit 1
fi

echo ""
echo "========================================="
echo "  Backend: http://localhost:3001"
echo "  Public:  $NGROK_URL"
echo "========================================="
echo ""

# Update .env in the app root
ENV_FILE="$(dirname "$0")/.env"
if grep -q "EXPO_PUBLIC_API_URL" "$ENV_FILE"; then
  sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=$NGROK_URL|" "$ENV_FILE"
else
  echo "EXPO_PUBLIC_API_URL=$NGROK_URL" >> "$ENV_FILE"
fi

echo "Updated .env with: EXPO_PUBLIC_API_URL=$NGROK_URL"
echo ""
echo "Now run: eas build --profile preview --platform android"
echo ""
echo "Press Ctrl+C to stop backend + ngrok"

wait $BACKEND_PID
