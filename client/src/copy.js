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
    mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm; codecs="vp8, opus"' });
    
    mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
            socket.emit('videoframes', event.data);
        }
    };
    mediaRecorder.start(1); // time slice 1ms
};

navigator.mediaDevices.getUserMedia({
    audio : true,
    video : true
}).then( stream => {
    window.stream = stream;
    localVideo.srcObject = stream;
})

mediaSource.addEventListener('sourceopen', function (e) {
   
    const mimeCodec = 'video/webm; codecs="vp8, opus"';
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
