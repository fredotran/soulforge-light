#!/usr/bin/env bash
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${HOME}/.local/bin"
CONFIG_DIR="${HOME}/.soulforge"

echo "=== SoulForge Light Installer ==="
echo ""

# Check for bun
if ! command -v bun &> /dev/null; then
  echo "Error: Bun is required but not found."
  echo "Install it: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

BUN_VERSION=$(bun --version)
echo "Found bun ${BUN_VERSION}"

# Check bun version (simple check for >= 1.3)
if ! bun --version | grep -qE "^1\.(3|[4-9])"; then
  echo "Warning: Bun >= 1.3.13 recommended. Current: ${BUN_VERSION}"
fi

echo ""
echo "Installing dependencies..."
cd "${REPO_DIR}"
bun install

echo ""
echo "Setting up executable..."
chmod +x "${REPO_DIR}/bin.sh"

# Ensure ~/.local/bin exists
mkdir -p "${BIN_DIR}"

# Create wrapper script
cat > "${BIN_DIR}/soulforge" << 'EOF'
#!/usr/bin/env bash
set -e
SCRIPT_DIR="REPO_DIR_PLACEHOLDER"
exec bun run "${SCRIPT_DIR}/src/boot.tsx" "$@"
EOF
sed -i "s|REPO_DIR_PLACEHOLDER|${REPO_DIR}|g" "${BIN_DIR}/soulforge"
chmod +x "${BIN_DIR}/soulforge"

# Also create sf alias
ln -sf "${BIN_DIR}/soulforge" "${BIN_DIR}/sf"

echo ""
echo "Ensuring config directory exists..."
mkdir -p "${CONFIG_DIR}/sessions"

echo ""
echo "========================================"
echo "Installation complete!"
echo ""
echo "Binary: ${BIN_DIR}/soulforge"
echo "Alias:  ${BIN_DIR}/sf"
echo "Config: ${CONFIG_DIR}/config.json"
echo ""

# Check if ~/.local/bin is on PATH
if [[ ":$PATH:" != *":${BIN_DIR}:"* ]]; then
  echo "WARNING: ${BIN_DIR} is not in your PATH."
  echo "Add this to your shell profile (~/.bashrc, ~/.zshrc, or ~/.config/fish/config.fish):"
  echo ""
  echo "  export PATH=\"${BIN_DIR}:\$PATH\""
  echo ""
fi

echo "Usage:"
echo "  soulforge                  Start the TUI"
echo "  soulforge --headless MSG   Run a single prompt"
echo "  soulforge --version        Show version"
echo "  soulforge --help           Show help"
echo ""
echo "First run: create ${CONFIG_DIR}/config.json with your API key:"
echo ""
echo '  {'
echo '    "provider": "anthropic",'
echo '    "model": "claude-sonnet-4",'
echo '    "apiKey": "sk-ant-...",'
echo '    "theme": "dark"'
echo '  }'
echo ""
echo "Or just run soulforge and use the built-in setup wizard."
echo "========================================"
