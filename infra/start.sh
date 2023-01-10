#!/bin/sh

node -r /opt/proxy/node_modules/dotenv/config /opt/proxy/server.js dotenv_config_path=/opt/proxy/.env &
nginx