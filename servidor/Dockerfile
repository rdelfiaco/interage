FROM nginx:alpine

WORKDIR /usr/share/interage/
RUN git clone https://12cfd35e80550f6fc4e58f975e9ac112966aaf54@github.com/rdelfiaco/interage.git

EXPOSE 8080
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx /etc/nginx