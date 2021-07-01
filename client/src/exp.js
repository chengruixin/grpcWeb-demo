// navigator.mediaDevices.getUserMedia({video : true})
//     .then( stream => {
//         const v1 = document.querySelector('#v1');
//         // Older browsers may not have srcObject
//         if ("srcObject" in v1) {
//             v1.srcObject = stream;
//         } else {
//             v1.src = window.URL.createObjectURL(stream);
//         }

//         return stream;
//     })
//     .catch( err => {
//         console.log(err);
//     })
//     .then( stream => {
//         const mediaRecorder = new MediaRecorder(stream, {
//             mimeType: 'video/webm; codecs="vp8, opus"'
//         });
//         //video/webm; codecs="av01.2.19H.12.0.000.09.16.09.1, flac"
//         //video/webm; codecs="vp8, opus"
//         return mediaRecorder;
//     })
//     .then( mediaRecorder => {
//         const bufferArray = [];
//         let mediaSource;
//         let sourceBuffer;
        
//         mediaRecorder.ondataavailable = dataEntity => {
//             const { data } = dataEntity;
//             const transformed = new Uint8Array(data);
        
//             if(sourceBuffer){
//                 if (!sourceBuffer.updating && bufferArray.length === 0) {
//                     sourceBuffer.appendBuffer(transformed);
//                     // console.log("add to source buffer");
//                 } else {
//                     bufferArray.push(transformed);
//                     // console.log("add to buffer array")
//                 }
//             }
//         }

//         const mimeCodec = 'video/webm; codecs="vp8, opus"';
//         mediaSource = new MediaSource();
        
//         // v2.srcObject = mediaSource;
        
//         mediaSource.addEventListener("sourceopen", function (e) {
//             sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
//             sourceBuffer.addEventListener("updateend", () => {
//                 console.log(bufferArray.length)
//                 if(bufferArray.length > 0 && !sourceBuffer.updating){
//                     sourceBuffer.appendBuffer(bufferArray.shift())
//                     console.log("add from array buffer")
//                 }
//             })
//         })
        
//         mediaRecorder.start(1);

//         const v2 = document.querySelector("#v2");
//         v2.src = window.URL.createObjectURL(mediaSource);
        
//         v2.onloadedmetadata = function () {
//             console.log('played')
//             v2.play();    
//         };
//     })
//     .catch(err => {
//         console.log("Error catched");
//         console.error(err)
//     })

var frames = [];
var localStream;
var mediaRecorder;
var mediaSource;
const video1 = document.querySelector("#video1");
const video2 = document.querySelector("#video2");

(async function Intialization(){
    localStream = await navigator.mediaDevices.getUserMedia({video : true});

    video1.srcObject = localStream;

    document.querySelector("#start").addEventListener("click", startRecording);
    document.querySelector("#end").addEventListener("click", endRecording);
})();


function startRecording(){

    //clear previous storage
    frames.splice(0, frames.length);

    mediaRecorder = new MediaRecorder(localStream, {
        mimeType: 'video/webm; codecs="vp8, opus"'
    });

    mediaRecorder.ondataavailable = data => {
        frames.push(data.data);
        console.log(frames.length);
    };

    mediaRecorder.start(200);

}

function endRecording(){
    if(!mediaRecorder) return;

    mediaRecorder.stop();
    setTimeout(() => {
        console.log("total length : ", frames.length);
    });

    const blob = new Blob(frames, {
        type : "video/webbm"
    });

    const url = window.URL.createObjectURL(blob);

    video2.src = url;
    // a.download = 'test.webm';
    // video2.click();
    // window.URL.revokeObjectURL(url);
    //start to show the recorded video
    // const mimeCodec = 'video/webm; codecs="vp8, opus"';
    // mediaSource = new MediaSource();

    // mediaSource.addEventListener("sourceopen", () => {
    //     const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        
    //     sourceBuffer.addEventListener("updateend", () => {
    //         console.log("e");
            
    //         if(frames.length > 0){
    //             sourceBuffer.appendBuffer(frames.shift());
    //         } else {
    //             console.log("start playing video")
    //             video2.play();
    //         }
    //     })


    //     sourceBuffer.appendBuffer(frames.shift())

    // })

    // video2.src = window.URL.createObjectURL(mediaSource);

}