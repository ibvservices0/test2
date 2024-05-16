'use strict';


function check_visible(valueX, valueY, valueZ){
    let btTakePhoto2 = document.getElementById("bt_takePhoto");
    var resp_check = false;
    var anguloX = Math.asin(valueX / -9.8) * 180 / Math.PI;
    anguloX = Math.abs(anguloX);
    if ((anguloX >= 30) && (anguloX <= 50)){
        resp_check = true;
    }
    var anguloY = Math.asin(valueY / -9.8) * 180 / Math.PI;
    anguloY = Math.abs(anguloY);
    if (anguloY > 10){
        resp_check = false;
    }
    if (resp_check) btTakePhoto2.removeAttribute("hidden");
    else btTakePhoto2.setAttribute("hidden", "hidden");
}

function handleMotion(event) {
    var ac0_0_raw = event.accelerationIncludingGravity.x;
    var ac1_0_raw = event.accelerationIncludingGravity.y;
    var ac2_0_raw = event.accelerationIncludingGravity.z;
    var ac0_0 = 0;
    if (ac0_0_raw > 9.8) ac0_0 = 9.8;
    else if (ac0_0_raw < -9.8) ac0_0 = -9.8;
    else ac0_0 = ac0_0_raw;
    var ac1_0 = 0;
    if (ac1_0_raw > 9.8) ac1_0 = 9.8;
    else if (ac1_0_raw < -9.8) ac1_0 = -9.8;
    else ac1_0 = ac1_0_raw;
    var ac2_0 = 0;
    if (ac2_0_raw > 9.8) ac2_0 = 9.8;
    else if (ac2_0_raw < -9.8) ac2_0 = -9.8;
    else ac2_0 = ac2_0_raw;
    let pose1 = {
        'ac0_0': ac0_0,
        'ac1_0': ac1_0,
        'ac2_0': ac2_0
    };
    localStorage.removeItem('feet_pose1');
    localStorage.setItem('feet_pose1', JSON.stringify(pose1));
    check_visible(ac0_0, ac1_0, ac2_0);
}


function tomaFoto(){
    let videoBis = document.getElementById("vid");
    //let mycanvasBis = document.getElementById("thecanvas");
    //mycanvasBis.getContext('2d').drawImage(videoBis, 0, 0, mycanvasBis.width, mycanvasBis.height);
    createImageBitmap(videoBis)
        .then(imageBitmap => {verEnCanvasBis(imageBitmap);})
        .catch(error => alert(error.message));
}


function verEnCanvas(img){
    let myvideoBis = document.getElementById("vid");
    //myvideoBis.setAttribute("hidden", "hidden");
    let mycanvasBis = document.getElementById("thecanvas");
    //mycanvasBis.removeAttribute("hidden")
    mycanvasBis.width = img.width;
    mycanvasBis.height = img.height;
    mycanvasBis.getContext('2d').drawImage(img, 0, 0);
}


function verEnCanvasBis(img){
    let myvideo = document.getElementById("vid");
    myvideo.setAttribute("hidden", "hidden");
    //myvideo.setAttribute('style', `width: 0px; height: 0px`);
    let mycanvas = document.getElementById("thecanvas");
    mycanvas.removeAttribute("hidden")
    //mycanvas.width = window.screen.width * window.devicePixelRatio;
    //mycanvas.height = window.screen.height * window.devicePixelRatio;
    mycanvas.width = window.screen.width;
    mycanvas.height = window.screen.height;
    //mycanvas.width = window.getComputedStyle(...).width.split('px')[0];
    //mycanvas.height = window.getComputedStyle(...).height.split('px')[0];
    let ratio  = Math.min(mycanvas.width / img.width, mycanvas.height / img.height);
    let x = (mycanvas.width - img.width * ratio) / 2;
    let y = (mycanvas.height - img.height * ratio) / 2;
    mycanvas.getContext('2d').clearRect(0, 0, mycanvas.width, mycanvas.height);
    mycanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
}


function gotDevices(deviceInfos) {
    let myDeviceId;
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        option.text = deviceInfo.label ;
        if (deviceInfo.kind === 'videoinput') {
            if ((option.text.includes('0,'))||
                (option.text === 'Cámara trasera')||
                (option.text === 'Back Camera')){
                    myDeviceId = option.value;
                    break;
            } else {console.log('Some other kind of source/device: ', deviceInfo);}
            
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    }
    return myDeviceId;
}


function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}


function handleErrorBis(error) {
    alert(error.message);
}


function start(myIdDevice) {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const videoSource = myIdDevice;
    /*
    const constraints = {
        audio: false,
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    */
   let constraints;
   if (videoSource){
        constraints = {
            audio: false,
            video: {deviceId: {exact: videoSource}}
        };
   }
   else{
        constraints = {
            audio: false,
            video: {facingMode: 'environment'}
        };
   }

    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleErrorBis);
}



function gotStream(stream) {
    let video = document.getElementById("vid");
    window.stream = stream; // make stream available to console

    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });

    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.applyConstraints({torch: true})
        .then(() => console.log(videoTrack.getSettings().torch));

}


let canvas = document.getElementById("thecanvas");
canvas.setAttribute("hidden", "hidden");

let but = document.getElementById("bt_takePhoto");
but.addEventListener("click", () => {
    window.removeEventListener("devicemotion", handleMotion);
    tomaFoto();
});

window.addEventListener("devicemotion", handleMotion);

navigator.mediaDevices.enumerateDevices().then(gotDevices).then(start).catch(handleError);
//start();
//navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleErrorBis);