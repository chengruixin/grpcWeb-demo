const PROTO_PATH = __dirname + '/helloworld.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync(
    PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}
)
var protoDescriptor = grpc.loadPackageDefinition(packageDef);
var helloworld = protoDescriptor.helloworld;

function doSayHello(call, callback) {
    callback(null, {
      message: 'Hello! ' + call.request.name + " ~~ " + "(this is message from grpc)"
    });
}

function serverStream(call) {
    console.log(call);
    console.log(call.request.requestMessage);

    const { requestMessage } = call.request;
    let start = requestMessage;
    {
        
        let timer = setInterval(()=>{
            call.write({responseMessage : start});
            start++;

            console.log(start);
            if(start > 10){
                clearInterval(timer);
                call.end();
                console.log("send stream completed");
            }
        }, 500);
    }
    
}

function biStream(request, response){
    console.log(request);
    console.log(response);

    request.on("data", (data) => {
        // console.log("read data from client ", data);
        const {requestMessage} = data;
        console.log("write " + requestMessage)
        request.write({responseMessage : requestMessage});
    })

    request.on("end", () => {
        console.log("end of connection");
    })

    request.on("error", (error) => {
        console.log(error)
    })

    request.write({responseMessage : String(1)});


}

function main() {
    const server = new grpc.Server();
    server.addService(helloworld.Greeter.service, {
        sayHello: doSayHello,
        serverStream : serverStream,
        biStream : biStream
    });
    server.bind('0.0.0.0:9090', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('server is running on port 9090');
}

main();