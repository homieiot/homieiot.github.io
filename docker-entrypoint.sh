#!/usr/bin/env bash
set -Eeo pipefail

./grabrepos.py
hugo
