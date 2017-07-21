# shana-server
A back-end implementation for registering mobile devices for push notifications. These notifications alert the user of new release of anime to download informed through a RSS feed.


# Installing mongodb on Ubuntu 16.04:
Source: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo nano /etc/systemd/system/mongodb.service

```
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
```

## Add to .bashrc:
alias mongo-start="sudo systemctl start mongodb"
alias mongo-stop="sudo systemctl stop mongodb"
alias mongo-status="sudo systemctl status mongodb"
alias mongo-shell="mongo"

A reboot may be required after the installation.

## Creating the database:
- `mongo-start`;
- `mongo-shell`

Inside the shell, run:
`use shana`

The machine is ready to use mongo as database;

Data files: `/var/lib/mongodb`
Log files: `/var/log/mongodb`


## Running the project

1) Install mongo-db and/or follow the "Creating the database" section;
2) Run `npm install` inside the project folder;
3) Run `node server.js` with mongodb service running;
