FROM nginx:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /usr/share/
RUN git clone https://3e05c6b42c79eeba167ab0d0895077e218f669c8@github.com/rdelfiaco/interage.git
WORKDIR /usr/share/interage
RUN git fetch
RUN git pull origin treinamento
RUN git checkout origin/treinamento

EXPOSE 8080
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx /etc/nginx