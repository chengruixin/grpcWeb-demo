import io from 'socket.io-client'   

const socket = io('http://localhost:8080', {transports: ['websocket', 'polling', 'flashsocket']});

const mediaSource = new MediaSource();
const callbackQueue = [];
const localVideo = document.querySelector('video#video1');
const remoteVideo = document.querySelector('video#video2');
const streamingBtn = document.querySelector('button#start');
let sourceBuffer;
let mediaRecorder;
let useWebSocket = true;
let hasSentData = false;
// let hasReceivedData = false;

streamingBtn.onclick = () => {
    mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm; codecs="vp8, opus"' });// default
    
    mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
            if(useWebSocket){
                socket.emit('videoframes', event.data);
            } else {
                handleBlobDataLocally(event.data);
            }

            // for benchmark
            if(!hasSentData){
                console.time("Latency")
                hasSentData = true;
            }
        }
    };
    mediaRecorder.start(1); 
    console.log(mediaRecorder.mimeType)
};

navigator.mediaDevices.getUserMedia({
    audio : true,
    video : true
}).then( stream => {
    window.stream = stream;
    localVideo.srcObject = stream;
})

mediaSource.addEventListener('sourceopen', function (e) {
    const mimeCodec = 'video/webm; codecs="vp8, opus"';// default

    sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    
    sourceBuffer.addEventListener('updateend', function () {
        if (callbackQueue.length > 0 && !sourceBuffer.updating) {
            sourceBuffer.appendBuffer(callbackQueue.shift());
        }
    });
}, false);

remoteVideo.src = window.URL.createObjectURL(mediaSource);

socket.on('videoframes', onConvertedDataAvailable);

async function handleBlobDataLocally(data) {
    if(data.arrayBuffer){
        const buffer = await data.arrayBuffer();
        onConvertedDataAvailable(buffer);
    }
}


function onConvertedDataAvailable(data){
    if (mediaSource.readyState === 'open') {
        const arrayBuffer = new Uint8Array(data);
        if (!sourceBuffer.updating && callbackQueue.length == 0) {
            sourceBuffer.appendBuffer(arrayBuffer);
        } else {
            callbackQueue.push(arrayBuffer);
        }

        // For benchmark
        if(hasSentData){
            console.timeEnd("Latency");
            hasSentData = false;
        }
    }
}