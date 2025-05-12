#!/usr/bin/env sh
set -euo

# As long as no changes are made to the Dockerfile, the built image
# will be cached and reused in all builds after the first one.
docker build -t homie-website-builder -f ./docker/Dockerfile-builder .

# No need for a dedicated entrypoint script, we can specify the commands
# to run as arguments to `docker run`. This keeps our image more flexible.
docker run --rm -v "$(pwd):/data" homie-website-builder sh -c "cd /data && ./grabrepos.py && hugo"
