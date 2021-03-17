const EventEmitter = require('events');
var registey={}
class duplex extends EventEmitter{
  constructor(props){
    super(props);
    this.on('message',(data)=>{
      if(this.self.onmessage){
        this.self.onmessage(this.who,data,this);
      }

    })
  }
  send(data){
    this.couple.emit('message',data);
  }
}
class Server{
  constructor(props){
    this.connected=[];
    this.name=props.name;
  }
  watch(port){
    if(registey[port]){
      return false;
    }
    else{
      registey[port]={
        listener:this
      }
      return true;
    }
  }
  onconnect(who){
    var self=new duplex();
    var couple=new duplex();
    self.self=this;
    couple.self=who;
    self.who=who;
    couple.who=this;
    self.couple=couple;
    couple.couple=self;
    this.connected.push({
      name:"",
      tar:self
    });

    return couple;
  }
  onmessage(who,data,res){

  }
  connect(port,name){
    let ser=registey[port]
    if(ser){
      let couple=ser.listener.onconnect(this);
      this.connected.push({
        name,
        tar:couple
      })
    }
  }
  send(data,name){
    for(var i=0;i<this.connected.length;++i){
      if(this.connected[i].name==name){
        this.connected[i].tar.send(data);
        return ;
      }
    }
  }
}


var server1=new Server({
  name:"server1"
});
var server2=new Server({
  name:"server2"
})
var server3=new Server({
  name:"server3"
})
server1.watch("8080");
server1.onmessage=function(who,data,res){
  res.send("receivedfrom "+who.name);
}
server2.onmessage=function(who,data,res){
  console.log(data);
}
server3.onmessage=function(who,data,res){
  console.log(data);
}
server2.connect("8080","server1");
server2.send({
  name:"helloworld"
},"server1");

server3.connect("8080","server1");
server3.send({
  name:"helloworld"
},"server1");
server3.onmessage=function(who,data,res){
  console.log(data);
}
console.log('done');



//
