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
    client.sayHello({
        name : "buidftt"
    }, function(err, res){
        if(err) {
            console.log(err);
            return;
        }
        console.log(res);
    })
    
}

main();