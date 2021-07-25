# docker_on_need
seperate docker deploying server made for ctf's

## Requirements

1. install node,npm and docker on server `Docker - sudo apt  install docker.io`
2. run `npm install`
3. place your challenge/app that you wanted to deploy in server
4. open port in server from 49152-65535
5. node server.js /path-to-folder-containing-dockerfile  `eg: node server.js app/`

## make changes in server.js

1. var local_port = "to your docker localport"
2. var port = "the port where deployer run"
3. const docker_name="name of docker"
4. var hostname="the host where challenge gona be up"


## functionalities

1. delete docker after 15 mins(can be controlled)



