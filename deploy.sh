#!/bin/bash
npm run build && \
sudo rm -rf /var/www/customers/* && \
sudo cp -r dist/* /var/www/customers/ && \
sudo chown -R www-data:www-data /var/www/customers && \
sudo systemctl reload nginx && \
echo "customers deployed successfully!"
