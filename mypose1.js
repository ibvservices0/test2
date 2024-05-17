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
    if (resp_check) btTakePhoto2.removeAttribute("disabled");
    else btTakePhoto2.setAttribute("disabled", "");;
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
    let ibmap_options = {
        resizeWidth: 720,
        resizeHeight: 960
    };
    createImageBitmap(videoBis, ibmap_options)
        .then(imageBitmap => {verEnCanvas(imageBitmap);})
        .catch(error => alert(error.message));
}

const getBase64StringFromDataURL = (dataURL) =>
    dataURL.replace('data:', '').replace(/^.+,/, '');


function verEnCanvas(img){
    let mydiv_takePhoto = document.getElementById("div_takePhoto");
    mydiv_takePhoto.style.display = 'none';
    let mydiv_vid = document.getElementById("div_vid");
    mydiv_vid.style.display = 'none';

    let mycanvas = document.getElementById("thecanvas");
    mycanvas.removeAttribute("hidden");
    
    mycanvas.width = img.width;
    mycanvas.height = img.height;
    mycanvas.getContext('2d').clearRect(0, 0, mycanvas.width, mycanvas.height);
    mycanvas.getContext('2d').drawImage(img, 0, 0);

    const the_dataURL = mycanvas.toDataURL('image/jpeg', 0.9);;
    // Logs data:image/png;base64,wL2dvYWwgbW9yZ...
    const the_base64 = getBase64StringFromDataURL(the_dataURL);
    // Logs wL2dvYWwgbW9yZ...
    localStorage.removeItem('feet_photo1');
    localStorage.setItem('feet_photo1', the_base64);
    verEnCanvasBis(img);
}


function verEnCanvasBis(img2){
    //let mydivBis_takePhoto = document.getElementById("div_takePhoto");
    //mydivBis_takePhoto.style.display = 'none';
    //let mydivBis_vid = document.getElementById("div_vid");
    //mydivBis_vid.style.display = 'none';
    let mycanvasBis = document.getElementById("thecanvas");
    //mycanvasBis.removeAttribute("hidden");
    
    //mycanvasBis.width = window.screen.width * window.devicePixelRatio;
    //mycanvasBis.height = window.screen.height * window.devicePixelRatio;
    mycanvasBis.width = window.screen.width;
    mycanvasBis.height = window.screen.height;
    //mycanvasBis.width = window.getComputedStyle(...).width.split('px')[0];
    //mycanvasBis.height = window.getComputedStyle(...).height.split('px')[0];
    let ratio  = Math.min(mycanvasBis.width / img2.width, mycanvasBis.height / img2.height);
    let x = (mycanvasBis.width - img2.width * ratio) / 2;
    let y = (mycanvasBis.height - img2.height * ratio) / 2;
    mycanvasBis.getContext('2d').clearRect(0, 0, mycanvasBis.width, mycanvasBis.height);
    mycanvasBis.getContext('2d').drawImage(img2, 0, 0, img2.width, img2.height, x, y, img2.width * ratio, img2.height * ratio);
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