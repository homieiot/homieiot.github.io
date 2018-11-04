#!/usr/bin/env bash
set -euo pipefail

echo "Manually building webpage"

python3 -m venv dependencies
source dependencies/bin/activate
pip install -r requirements.txt
./grabrepos.py
mkdocs build

echo "Webpage available at ./site"
