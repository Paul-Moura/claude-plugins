#!/bin/bash
# Setup script for locale-translations MCP server (Unix)
# This script installs dependencies and builds the TypeScript server

cd "$(dirname "$0")"

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed"
    exit 1
fi

echo "Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi

echo ""
echo "Setup complete! The MCP server has been built successfully."
