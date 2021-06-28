const PROTO_PATH = __dirname + '/helloworld.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

var protoDescriptor = grpc.loadPackageDefinition(packageDef);
var helloworld = protoDescriptor.helloworld;

function main() {
  
    const client = new helloworld.Greeter('localhost:8080', grpc.credentials.createInsecure());
    // console.log(client); 
    // client.sayHello({
    //     name : "buidftt"
    // }, function(err, res){
    //     if(err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log(res);
    // })
    
    // let stream = client.serverStream({requestMessage : "hello"});

    // stream.on("data", data => {
    //     console.log(data);
    // })

    // stream.on("end", () => {
    //     console.log("end");
    // })
    let biStream = client.biStream();

    // console.log(biStream)

    biStream.on('data', data => {
        console.log(data);

        const {responseMessage} = data;

        if(responseMessage <= 20) {
            biStream.write({requestMessage : responseMessage+1})
        } else {
            biStream.end();
            biStream.cancel();
        }
    })

    biStream.on("end", () => {
        console.log("end of connection");
    })

    biStream.on("error", (error) => {
        // console.log(error)
    })

    biStream.on("status", status => {
        console.log(status)
    })
}

main();