#name of the domain by the user
echo Please enter the domain name, without 'www'
read domain
echo The Doamin is $domain
echo Please enter the port where the website will be served:
read port
echo The website will be served at $domain:$port

# Next lets create the appropraite file
sudo touch /etc/nginx/sites-available/$domain
#Let's edit the nginx file
content="server {
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name $domain www.$domain;
        location / {
                proxy_pass http://localhost:$port;
        }
}"
echo $content | sudo tee /etc/nginx/sites-available/$domain
# link the file to a server block
sudo ln -s /etc/nginx/sites-available/$domain /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d $domain -d www.$domain