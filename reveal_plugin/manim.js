window.RevealManim = {
  id: 'manim',
  video_dir: 'videos',
  init: (deck) => {
    // TODO load the transition timestamps and add the fragments to the DOM
    // TODO set up the Reveal event listeners to handle fragment transitions
    // TODO test Manip and see whether the video generation process works

    slides = Reveal.getSlides();
    for (var i = 0; i<slides.length; i++) {
      slide = slides[i];

      if (slide.matches(".fv-background")) {
        // this slide has a video playing as its background
        video_path = slide.getAttribute("fv-video");
        // TODO set up a local server so files can be loaded?
        playback_info = load_playback_info(slide.getAttribute("fv-playback-info"));

        // TODO implement
      }
      videos = slide.querySelectorAll(".fragment-video");

      for (var j = 0; i < videos.length; j++) {
        video = videos[j];
        video_path = video.getAttribute("fv-video");
        playback_info = load_playback_info(slide.getAttribute("fv-playback-info"));

        // TODO set up the video
      }
    }
  }
}

function load_playback_info(url) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  // TODO use an asynchronous method instead of this
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  else {
    console.error("Failed to load playback info from " + url);
  }
  return result;
}