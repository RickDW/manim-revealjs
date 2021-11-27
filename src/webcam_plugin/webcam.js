window.RevealWebcam = {
    id: "webcam",
    init: () => {
        video_elem = document.createElement("video");
        video_elem.setAttribute("id", "webcam");
        video_elem.setAttribute("style", "position: absolute");

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
            slide.appendChild(video_elem);
        })
        .catch(function(error) {
            console.log(error.name + ": " + error.message);
        });
    }
};