FROM python:3.11.7-bullseye

# Copy the local repo contents
COPY ./ /work
WORKDIR /work


RUN pip install -r requirements.txt


# Install Hugo
RUN wget https://github.com/gohugoio/hugo/releases/download/v0.102.3/hugo_extended_0.102.3_Linux-64bit.deb -O /tmp/hugo.deb \
    && dpkg -i /tmp/hugo.deb


ENTRYPOINT ["/work/docker-entrypoint.sh"]
