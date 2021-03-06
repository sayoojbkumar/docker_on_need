var net = require('net');
var rn = require('random-number');
const { exec } = require('child_process');
const { stdout, argv } = require('process');
var answers = {}

var port=49152
var local_port="8088"
const docker_name="exampledocker"
var hostname="localhost"


if(argv[2]){
  build_docker(argv[2])
}
else{
  console.log("no path provided \n example: node server.js /app/deploy")
  process.exit()
}

var server = net.createServer();    
server.on('connection', handleConnection);

server.listen(8080, function() {    
  console.log('server listening to %j', server.address());  
});

function build_docker(path) {
  var build=`cd ${path}; sudo docker build -t ${docker_name} .`
  exec(build,(err,stdout)=>{
    if(err){
      console.log(err)
      console.log("some error with building docker check ur path")
      process.exit(1)
    }
    console.log(stdout)
  })
}

function dealocate() {
    var command1="sudo docker ps | awk '{print $1,$4,$5}'|grep -i 'minutes'"
    exec(command1,(err,stdout)=>{
        var s=stdout.split("\n")
        console.log(s)
        if(s){
            for(var i=0; i<(s.length-1);i++){
                var dockerid=s[i].slice(0,12)
                var time=s[i].slice(13,15)
                if(time>5){
                    var command2=`sudo docker rm --force ${dockerid}`
                    console.log(command2)
                    try{
                        exec(command2,(stdout)=>{
                            console.log(stdout)
                        })
                    }
                    catch(e){
                        return
                    }
                }
            }
        }
    })
}


function deploy(){
    console.log("deployment code here")
    var command=`sudo docker run -p ${port}:${local_port} ${docker_name}`
    console.log(port)
    port=port+1
    exec(command, (err, stdout, stderr) => {
    if (err) {
        console.log(err);
    }
    });
}

function question(){
    var gen = rn.generator({
        min:  1,
        max:  1000,
        integer: true
      })
      var symbol = rn.generator({
        min:  0,
        max:  4,
        integer: true
      })
      var one=gen()
      var two=gen()
      var three=symbol()
      var symbols=['-','+','/','%','^']
      var expression=one+symbols[three]+two
      var answer=eval(expression)
      return [answer,expression]
}

function handleConnection(conn) {    
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;  
  console.log('new client connection from %s', remoteAddress);
  dealocate()  
  test=question()
  console.log(test[0])
  console.log(test[1])
  answers[conn.remoteAddress]=test[0]
  console.log(answers)
  console.log(answers[conn.remoteAddress])
  conn.write("\n answer the folowing get docker deployed\n");
  conn.write('\n '+test[1]+' ?'+'\n')
  conn.setEncoding('utf8');

  conn.on('data', onConnData);  
  conn.once('close', onConnClose);  
  conn.on('error', onConnError);

  function onConnData(d) {  
    console.log('connection data from %s: %j', remoteAddress, d);
    if(d==answers[conn.remoteAddress]){
        delete answers[conn.remoteAddress]
        conn.write("\n...........................................deploying your instance ...........................................\n")
        deploy()
        conn.write("\n wait for few seconds to get deployed your challenge will be visible at is\n")
        conn.write(`\n ${hostname}:`+(port-1))
    }
    else{
        conn.write("\n wrong answer :( \n")
    }  
  }

  function onConnClose() {  
    console.log('connection from %s closed', remoteAddress);  
  }

  function onConnError(err) {  
    console.log('Connection %s error: %s', remoteAddress, err.message);  
  }  
}
