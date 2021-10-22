window.RevealWebcam = {
    id: "webcam",
    init: () => {
        video_elem = document.createElement("video");

        slide = Reveal.getSlides()[0];
        return navigator.mediaDevices.getUserMedia({
            "audio": true,
            "video": true
        })
        .then(function(stream) {
            video_elem.srcObject = stream;
            video_elem.onloadedmetadata = function(e) {
                video_elem.play();
            }
            slide.appendElement(video_elem);
        })
        .catch(function(error) {
            console.log(error.name + ": " + error.message);
        });
    }
};