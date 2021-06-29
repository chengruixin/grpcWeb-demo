import io from 'socket.io-client'   

const socket = io('http://localhost:8080', {transports: ['websocket', 'polling', 'flashsocket']});

const mediaSource = new MediaSource();
const callbackQueue = [];
let sourceBuffer;
let mediaRecorder;

const localVideo = document.querySelector('video#video1');
const remoteVideo = document.querySelector('video#video2');
const streamingBtn = document.querySelector('button#start');
streamingBtn.onclick = () => {
    // mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm; codecs="vp8, opus"' });// default
    mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm; codecs="avc1.42E01E"' });
    
    mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
            socket.emit('videoframes', event.data);
        }
    };
    mediaRecorder.start(1); // time slice 1ms
    console.log(mediaRecorder.mimeType)
};

navigator.mediaDevices.getUserMedia({
    // audio : true,
    video : true
}).then( stream => {
    window.stream = stream;
    localVideo.srcObject = stream;
})

mediaSource.addEventListener('sourceopen', function (e) {
   
    //const mimeCodec = 'video/webm; codecs="vp8, opus"';// default
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E"';

    sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    
    sourceBuffer.addEventListener('updateend', function () {
        if (callbackQueue.length > 0 && !sourceBuffer.updating) {
            sourceBuffer.appendBuffer(callbackQueue.shift());
        }
    });
}, false);

remoteVideo.src = window.URL.createObjectURL(mediaSource);

socket.on('videoframes', function (data) {
    if (mediaSource.readyState == 'open') {
        const arrayBuffer = new Uint8Array(data);
        if (!sourceBuffer.updating && callbackQueue.length == 0) {
            sourceBuffer.appendBuffer(arrayBuffer);
        } else {
            callbackQueue.push(arrayBuffer);
        }
    }
});

{

    const codecs = [
        'video/mp4; codecs=avc1.42E01E',
        'video/mp4; codecs=H264',
        'video/mp4; codecs=h264',
        'video/mp4; codecs=avc1',
        'video/mp4; codecs=vp8',
        'video/webm; codecs=avc1.42E01E',
        'video/webm; codecs=H264',
        'video/webm; codecs=h264',
        'video/webm; codecs=avc1',
        'video/webm; codecs=vp8'
    ]

    for(let codec of codecs){
        if(MediaRecorder.isTypeSupported(codec)){
            console.log("MediaRecorder supports :", codec);
        } else {
            console.log("MediaRecorder does not support :", codec);

        }
    }

    // for(let codec of codecs){
    //     if(MediaSource.isTypeSupported(codec)){
    //         console.log("MediaSource supports :", codec);
    //     } else {
    //         console.log("MediaSource does not support :", codec);

    //     }
    // }
}