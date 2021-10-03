window.RevealManim = {
  id: 'manim',
  video_dir: 'videos',
  init: (deck) => {
    // TODO refactor the fragment creation code, there's a lot of repetition

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

        // Create a last element so animations always stop at the end if you play through
        var data = fragments.at(-1) // last fragment
        data["background-video"] = true;
        data["start"] = data["end"];
        var elem = create_HTML_fragment(data);
        elem.classList.add("fv-final-fragment");
        slide.appendChild(elem);
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

        // Create a last element so animations always stop at the end if you play through
        var data = fragments.at(-1) // last fragment
        data["background-video"] = false;
        data["start"] = data["end"];
        var elem = create_HTML_fragment(data);
        elem.classList.add("fv-final-fragment");
        video.appendChild(elem);
      }
    }


    Reveal.addEventListener("fragmentshown", function(event) {
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

            if (event.fragment.matches(".fv-final-fragment")) {
              // go on the next one, this was a dummy fragment
              // since this is inside 'fragmentshown', we know we're going forward
              Reveal.next();
            }
          }
        };
      }
    });

    Reveal.addEventListener("fragmenthidden", function(event) {
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

        if (event.fragment.matches(".fv-final-fragment")) {
          // go on the previous one, this was a dummy fragment
          // since this is inside 'fragmenthidden', we know we're going backward
          Reveal.prev();
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
