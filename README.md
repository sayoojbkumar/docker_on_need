# docker_on_need
seperate docker deploying server made for ctf's

## Requirements

1. install node,npm and docker on server `Docker - sudo apt  install docker.io`
2. run `npm install`
3. place your challenge in server
4. build ur challenge docker which u want to deploy eg: `docker build -t name .` 
5. open port in server from 49152-65535

## make changes in server.js

1. `function deploy()` `docker run -p ${port}:"ur docker port" "your docker name that u builded"`
2. `function onConnData(d)`  `conn.write("\n place-your-host-here:"+port)`


## functionalities

1. delete docker after 15 mins(can be controlled)



