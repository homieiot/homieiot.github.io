# Docker build support

To build a container that contains everything required to build and update the website execute the following command.

`docker build . -f docker/Dockerfile -t homie-site:dev`

After that the docker image can be used to build the website in the current directory using something like this.

`docker run --rm -v $PWD:/work homie-site:dev`