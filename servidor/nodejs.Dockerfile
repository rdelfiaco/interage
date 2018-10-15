FROM node:8

RUN apt-get update && \
    apt-get install -y git-core nodejs npm

WORKDIR /usr/share/
RUN git clone https://3e05c6b42c79eeba167ab0d0895077e218f669c8@github.com/rdelfiaco/interage.git

WORKDIR /usr/share/interage/interage-back-end
RUN git fetch
RUN git checkout origin/treinamento

RUN npm install

EXPOSE 3000
CMD [ "node", "index.js" ]