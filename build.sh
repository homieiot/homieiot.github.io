#!/usr/bin/env bash

set -euo pipefail

./grabrepos.py
mkdocs build
