FROM public.ecr.aws/nginx/nginx:1.23.3

WORKDIR /tmp
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | sh - && \
  apt-get install -y nodejs

COPY ./infra/nginx.conf /etc/nginx/nginx.conf
COPY ./infra/default.conf /etc/nginx/conf.d/default.conf
COPY ./infra/start.sh /opt/start.sh
RUN chmod 744 /opt/start.sh

CMD ["/opt/start.sh"]