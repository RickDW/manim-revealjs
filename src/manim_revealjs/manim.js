window.RevealManim = {
  id: 'manim',
  video_dir: 'videos',
  init: (deck) => {
    // Initial setup: create fragments
    slides = Reveal.getSlides();
    for (var i = 0; i<slides.length; i++) {
      slide = slides[i];

      // Use a video as a slide's background
      if (slide.matches(".fv-background")) {
        video_setup(slide, true);
      }

      // Set up individual video elements
      videos = slide.querySelectorAll(".fv-video");

      for (var j = 0; j < videos.length; j++) {
        video_setup(videos[j], false);
      }
    }

    // Event handlers
    Reveal.addEventListener("fragmentshown", forward_trigger);
    Reveal.addEventListener("fragmenthidden", backward_trigger);
  }
}


// *****
// ** Functions for the initial setup
// *****


// sets up the video fragments
function video_setup(elem, is_slide) {
  if (is_slide) {
    // elem is a slide <section>, otherwise it's a <vid>
    video_path = elem.getAttribute("fv-video");
    elem.setAttribute("data-background-video", video_path);
  }

  // download the data describing the video fragments
  playback_info = load_playback_info(elem.getAttribute("fv-playback-info"));
  fragments = playback_info["fragments"];

  // create HTML elements for all fragments
  for (var k = 0; k<fragments.length; k++) {
    var data = fragments[k];
    data["background-video"] = is_slide;

    var frag_elem = create_HTML_fragment(data);
    elem.appendChild(frag_elem);
  }

  // Create a last element so animations always stop at the end if you're skipping through slides
  var data = fragments.at(-1) // last fragment
  data["background-video"] = is_slide;
  data["start"] = data["end"];
  var frag_elem = create_HTML_fragment(data);
  frag_elem.classList.add("fv-final-fragment");
  elem.appendChild(frag_elem);
}


// downloads the video timestamps which define the fragments
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


// create a single HTML fragment for a piece of video
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


// *****
// ** Functions for navigating through the animations
// *****

// triggered by revealjs's fragmentshown event -> indicates we're going through the slides forwards
function forward_trigger(event) {
  if (event.fragment.matches(".fv-fragment")) {
    set_up_timeupdate(event.fragment);
  }
}


// helper function for forward_trigger
function set_up_timeupdate(fragment) {
  var time_start = fragment.getAttribute("time_start");
  var time_end = fragment.getAttribute("time_end");
  var fragment_type = fragment.getAttribute("fragment_type");
  var background_video = fragment.getAttribute("background_video") == "true";

  if (background_video) {
    var current_slide = Reveal.getCurrentSlide();
    var video_elem = current_slide.slideBackgroundElement
      .getElementsByTagName("video")[0];
  }
  else {
    var video_elem = fragment.parentElement;
  }
    
  var prev_index = Number(fragment.getAttribute("data-fragment-index")) - 1;
  var prev_frag = Reveal.getCurrentSlide().querySelector(
    `.fv-fragment[data-fragment-index='${prev_index}']`);

  if (prev_frag && prev_frag.getAttribute("fragment_type") == "complete_loop") {
    // the previous fragment needs to be played to the end, so check whether it is in the middle of playing
    end_prev = prev_frag.getAttribute("time_end");
    if (video_elem.currentTime < end_prev) {
      // it's in the middle of playing, so let's not go on to the next fragment until the end of the fragment
      video_elem.setAttribute("vf-exit-loop", "true");
      return;
    }
  }

  video_elem.ontimeupdate = function() {};
  video_elem.currentTime = time_start;
  video_elem.play();
  video_elem.ontimeupdate = function() {
    if (video_elem.currentTime - time_end > 0){
      video_elem.pause();
      video_elem.currentTime = time_end;

      if (fragment.matches(".fv-final-fragment")) {
        // go on the next one, this was a dummy fragment
        // since this is inside 'fragmentshown', we know we're going forward
        video_elem.ontimeupdate = function() {};
        Reveal.next();
      }
      else if (fragment_type == "no_pause") {
        // immediately go on to the next one (also applies to the last fragment, not .fv-final-fragment)
        video_elem.ontimeupdate = function() {};
        Reveal.next();
      }
      else if (fragment_type == "loop" || (fragment_type == "complete_loop" 
          && video_elem.getAttribute("vf-exit-loop") != "true")) {
        // go back to the start
        video_elem.currentTime = time_start;
        video_elem.play();
      }
      else if (fragment_type == "complete_loop" && video_elem.getAttribute("vf-exit-loop") == "true") {
        video_elem.setAttribute("vf-exit-loop", "false");

        // after this, we'll go on to the next fragment, but for some reason there will not be
        // a fragmentshown event. This means that we'll have to call the event handler manually
        var next_index = Number(fragment.getAttribute("data-fragment-index")) + 1;
        var next_frag = Reveal.getCurrentSlide().querySelector(
          `.fv-fragment[data-fragment-index='${next_index}']`);
        set_up_timeupdate(next_frag);
      }
    }
  };
}


// triggered by revealjs's fragmenthidden event -> indicates we're going through the slides backwards
function backward_trigger(event) {
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
}