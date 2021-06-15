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
      message: 'Hello! ' + call.request.name + " ~~ "
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(helloworld.Greeter.service, {
        sayHello: doSayHello,
    });
    server.bind('0.0.0.0:9090', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('server is running on port 9090');
}

main();