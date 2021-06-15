const {HelloRequest, HelloReply} = require('./helloworld_pb.js');
const {GreeterClient} = require('./helloworld_grpc_web_pb.js');

var client = new GreeterClient('http://localhost:8080');

// client.sayHello({
//   name : "fdf"
// }, (err, response) => {
//   if(err) {
//     console.log(err);
//     return;
//   }
  
//   console.log("hello try");
//   console.log(response);
// });


var request = new HelloRequest();
request.setName('madmfamsdf');

client.sayHello(request, {}, (err, response) => {
  if(err) {
    console.log(err);
    return;
  }
  
  console.log("hello try");
  console.log(response.getMessage());
});

// client.sayHello(function(err, res){
//   if(err) {
//     console.log(err);
//     return;
//   }

//   console.log(res);
// })