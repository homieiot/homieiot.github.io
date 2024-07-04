#!/usr/bin/env bash
set -Eeo pipefail

cd /work

./grabrepos.py
hugo
