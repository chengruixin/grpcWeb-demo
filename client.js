const {HelloRequest, HelloReply, DataRequest} = require('./helloworld_pb.js');
const {GreeterClient} = require('./helloworld_grpc_web_pb.js');

var client = new GreeterClient('http://localhost:8080');

// var request = new HelloRequest();
// request.setName('fsdf');

// client.sayHello(request, {}, (err, response) => {
//   if(err) {
//     console.log(err);
//     return;
//   }
  
//   console.log(response.getMessage());
// });

let streamRequest = new DataRequest();
streamRequest.setRequestmessage(1);
var stream = client.serverStream(streamRequest, {});

stream.on('data', function(response) {
  console.log(response.getResponsemessage());
});

stream.on('status', function(status) {
  // console.log(status.code);
  // console.log(status.details);
  // console.log(status.metadata);
});

stream.on('end', function(end) {
  // stream end signal
  console.log("end of connection")
});