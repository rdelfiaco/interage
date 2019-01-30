FROM node:8

RUN apt-get update && \
    apt-get install -y git-core nodejs npm

WORKDIR /usr/share/
RUN git clone https://3e05c6b42c79eeba167ab0d0895077e218f669c8@github.com/rdelfiaco/interage.git

WORKDIR /usr/share/interage/server
RUN git fetch
RUN git pull origin tendenciaParaMeta
RUN git checkout origin/tendenciaParaMeta

RUN npm install

EXPOSE 3010
CMD [ "node", "index.js" ]