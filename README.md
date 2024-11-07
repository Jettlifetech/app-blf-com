# This repo is for the domain: "app.brokenlinksfinder.com" continued development 

## Need to develop the following
1. Need to add some sort of progress indicator:
    - [] A progress bar?
    - [] Some sort of indicator of how many URLs are found?
    - [] how many have been scanned?
2. Add functionality to generate a CSV or JSON report from the terminal output
3. Provide a download button for the generated report
 


# Current progress
1. Save Repo changes - scans sites through browser UX web app allowing user to modify the way it crawls the website, and provides real-time feedback that is fully working. Still need improvements - see readme


# Deploying
1. download to directory where u want to install
2. ```npm install```
3. modify Virtual host configuration making the ports = same as whats in server.js
    ```
    <VirtualHost *:80>
    ServerName app.brokenlinksfinder.com

    # Proxy requests to Node.js server
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / http://127.0.0.1:4302/
    ProxyPassReverse / http://127.0.0.1:4302/

    # WebSocket proxy support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://127.0.0.1:4302/$1" [P,L]

    ErrorLog ${APACHE_LOG_DIR}/cmd-app-error.log
    CustomLog ${APACHE_LOG_DIR}/cmd-app-access.log combined
    </VirtualHost>```