FROM ubuntu:focal

RUN apt update
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt upgrade -y
RUN apt install -y nodejs
RUN apt install -y git

WORKDIR /home/app

COPY package*.json .
RUN npm ci --production

COPY main.sh .
COPY script.js .

RUN chmod +x main.sh
RUN chmod +x script.js

ENTRYPOINT [ "/home/app/main.sh" ]