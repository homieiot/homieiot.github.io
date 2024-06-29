FROM python:3.12-slim-bookworm

RUN apt update \
    && apt install -y wget git \
    && git config --global --add safe.directory '*'

# Copy the local repo contents
COPY ./requirements.txt /requirements.txt
COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh

RUN pip install -r requirements.txt

# Install Hugo
RUN wget https://github.com/gohugoio/hugo/releases/download/v0.102.3/hugo_extended_0.102.3_Linux-64bit.deb -O /tmp/hugo.deb \
    && dpkg -i /tmp/hugo.deb

WORKDIR /work
VOLUME [ "/work" ]

ENTRYPOINT ["/docker-entrypoint.sh"]
