import io from 'socket.io-client'   
import JMuxer from 'jmuxer';

function openWebSocket() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('open', () => {
            resolve(ws);
        })

        ws.addEventListener('error', () => {
            reject(ws);
        })
    })
}

(async function main() {
    const stream = await navigator.mediaDevices.getUserMedia({video : true});
    const ws = await openWebSocket();
    const mediaSource = new MediaSource();
    const callbackQueue = [];
    const localVideo = document.querySelector('video#video1');
    const remoteVideo = document.querySelector('video#player');
    const streamingBtn = document.querySelector('button#start');
    let sourceBuffer;
    let mediaRecorder;
    let useWebSocket = true;
    let hasSentData = false;

    // set stream
    localVideo.srcObject = stream;

    /** Muxer Test start */
    var jmuxer = new JMuxer({
        node: 'player',
        mode: 'video',
        flushingTime: 1000,
        fps: 30,
        debug: true
    });
  
    ws.addEventListener('message', message => {
        // console.log(message.data);
        jmuxer.feed({
            video: new Uint8Array(message.data)
        });
    })
    /** Muxer Test end */

    streamingBtn.onclick = () => {
        // mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs="vp8, opus"' });// default
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs="avc1"' });// default
        
        mediaRecorder.ondataavailable = event => {
            if (event.data && event.data.size > 0) {
                // console.log(event.data);
                ws.send(event.data);
            }
        };
        mediaRecorder.start(1); 
        console.log(mediaRecorder.mimeType)
    };
})();



