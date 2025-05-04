
# This Dockerfile is not meant to be used directly but, rather,
# through the ../build.sh script.

# Build upon an official Python image using Alpine Linux as its base, which
# tends to result in smaller images and faster builds.
FROM python:3.12-alpine3.21

# Update Alpine's package list.
RUN apk update

# Install git, which is required by the grabrepos.py script.
RUN apk add --no-cache git

# Install Hugo from Alpine's package repository.
RUN apk add --no-cache hugo

# Copy list of Python dependencies and install them.
COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

# Prepare the /data volume to be used as the mount point for
# the local clone of this repository.
RUN mkdir /data
VOLUME /data
WORKDIR /data
