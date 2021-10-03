window.RevealManim = {
  id: 'manim',
  video_dir: 'videos',
  init: (deck) => {
    // TODO load the transition timestamps and add the fragments to the DOM
    // TODO set up the Reveal event listeners to handle fragment transitions

    slides = Reveal.getSlides();
    for (var i = 0; i<slides.length; i++) {
      slide = slides[i];

      if (slide.matches(".fv-background")) {
        // this slide should have a video playing as its background
        video_path = slide.getAttribute("fv-video");
        playback_info = load_playback_info(slide.getAttribute("fv-playback-info"));
        fragments = playback_info["fragments"];

        // set up the video background
        slide.setAttribute("data-background-video", video_path);
        // TODO allow color customization?
        // slide.setAttribute("data-background-color", "#000000");

        for (var k = 0; k<fragments.length; k++) {
          var data = fragments[k];
          data["background-video"] = true;

          var elem = create_HTML_fragment(data);
          slide.appendChild(elem);
        }
      }

      // Set up individual video elements
      videos = slide.querySelectorAll(".fv-video");

      for (var j = 0; j < videos.length; j++) {
        video = videos[j];
        playback_info = load_playback_info(video.getAttribute("fv-playback-info"));
        fragments = playback_info["fragments"];

        for (var k = 0; k<fragments.length; k++) {
          var data = fragments[k];
          data["background-video"] = false;

          var elem = create_HTML_fragment(data);
          video.appendChild(elem); //TODO find a better place to put these?
        }
      }
    }


    Reveal.addEventListener("fragmentshown", function(event) {
      // TODO implement functionality for going through the slides backwards
      if (event.fragment.matches(".fv-fragment")) {
        var time_start = event.fragment.getAttribute("time_start");
        var time_end = event.fragment.getAttribute("time_end");
        var fragment_type = event.fragment.getAttribute("fragment_type");
        var background_video = event.fragment.getAttribute("background_video") == "true";

        if (background_video) {
          var current_slide = Reveal.getCurrentSlide();
          var video_elem = current_slide.slideBackgroundElement
            .getElementsByTagName("video")[0];
        }
        else {
          var video_elem = event.fragment.parentElement;
        }
          
        video_elem.ontimeupdate = function() {};
        video_elem.currentTime = time_start;
        video_elem.play();
        video_elem.ontimeupdate = function() {
          if (video_elem.currentTime - time_end > 0){
            video_elem.pause();
            video_elem.currentTime = time_end;
            video_elem.ontimeupdate = function() {};
          }
        };
      }
    });

    Reveal.addEventListener("fragmenthidden", function(event) {
      // TODO figure out when this event occurs
      if (event.fragment.matches(".fv-fragment")) {
        var time_start = event.fragment.getAttribute("time_start");
        var time_end = event.fragment.getAttribute("time_end");
        var fragment_type = event.fragment.getAttribute("fragment_type");
        var background_video = event.fragment.getAttribute("background_video") == "true";
        
        if (background_video) {
          var current_slide = Reveal.getCurrentSlide();
          var video_elem = current_slide.slideBackgroundElement
            .getElementsByTagName("video")[0];
        }
        else {
          var video_elem = event.fragment.parentElement;
        }
          
        video_elem.currentTime = time_start;
        video_elem.pause();
        }
    });

    Reveal.addEventListener("slidechanged", function(event) {
      // TODO figure out when this event occurs
      if (event.hasOwnProperty("fragment") && event.fragment.matches(".fv-fragment")) {
        var time_start = event.fragment.getAttribute("time_start");
        var time_end = event.fragment.getAttribute("time_end");
        var fragment_type = event.fragment.getAttribute("fragment_type");
        var background_video = event.fragment.getAttribute("background_video") == "true";
        
        if (background_video) {
          var current_slide = Reveal.getCurrentSlide();
          var video_elem = current_slide.slideBackgroundElement
            .getElementsByTagName("video")[0];
          
          Reveal.navigateFragment(-1, 0);
          Reveal.next();
        }
        else {
          // TODO implement functionality for standalone video elements (??)
        }
      }
    });
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
  return JSON.parse(result);
}


function create_HTML_fragment(fragment_data) {
  time_start = fragment_data["start"];
  time_end = fragment_data["end"];
  fragment_type = fragment_data["fragment-type"];
  background_video = fragment_data["background-video"];

  // create a fragment
  var elem = document.createElement("div");
  elem.classList = ["fragment fv-fragment"];
  elem.setAttribute("time_start", time_start);
  elem.setAttribute("time_end", time_end);
  elem.setAttribute("fragment_type", fragment_type);
  elem.setAttribute("background_video", background_video);

  return elem;
}
