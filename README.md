# Manim and Reveal.js plugins for using mathematical animations in your slides

This project contains the required plugins to use the beautiful mathematical animations that are made possible by [Manim](https://www.manim.community) in presentation slides made with [Reveal.js](https://github.com/hakimel/reveal.js). Manim was originally created by Grant Sanderson from the Youtube channel [3B1B](https://www.youtube.com/c/3blue1brown) which is well known for its pretty and clear mathematical animations.

(This is a fork of [manim_slides](https://github.com/chubbc/manim_slides) which itself is a fork of [manim_reveal](https://github.com/anjandn/manim_reveal). Both repositories were created with the same goal as this repository, but since they do not seem to be actively maintained I created this repo for my own use)

**Update (27-11-2021):** The project is now in a state where it's easy to set up and use it. If you're using it I'd love to hear about it :)

## Installation
The Python package can be installed by running the command `pip install manim-revealjs`. To start using the Revealjs plugin in your slide deck you only need to include a `<script src="manim.js">`in your HTML file. The `manim.js` can be copied into your working directory by calling the function `manim_revealjs.plugin.export()`. In the `How to use` section it will be explained how you can add Manim videos to your slide deck.

## Easy-to-use presentation template

To make it really easy to create a new presentation that uses manim-revealjs, I have provided a [repository that you can clone](http://github.com/RickDW/presentation-template). You can edit the slides in any way you want, and then you can simply use python's built-in HTTP server to start your presentation. It requires no installation and the server can be started with one command: `python -m http.server`. If you then navigate to [localhost:8000](https://localhost:8000) you will see your presentation.

## Demo

Once everything is installed you can run the demo that is provided in the `example-presentation` directory. For more details you can read the README in that directory.

## How to use the plugins
To add Manim animations to your presentation you first need to render them. In order to make the integration with Reveal.js as smooth as possible you can use the Manim plugin's `PresentationScene`. There are no major differences with the normal `Scene` that you're used to, except for the `PresentationScene`'s `end_fragment()` method. If this method is called in the scene's `construct()` method it means there will be a pause in the animation when it is displayed in the slide deck. **Important:** every `construct()` you define **needs** to end with an `end_fragment()` call to correctly handle the animation.

Once the animations have been rendered, you can link them in your slide deck. Here you have two options: either you display the animations fullscreen as the background of a slide, or you add them along with the rest of the objects in your slides.

If you want to go for the first option, the slide's `<section>` should be given the `fv-background` class (short for *fragmented video class*). Next you need to set its `fv-video` attribute to the video's url, and its `fv-playback-info` attribute to the url of the `.json` file that was generated when you rendered the video. (This last file contains the timestamps of the different fragments of your video).

If you want to go for the second option of embedding your video like any other slide content, you can simply add a `<video>` element with some extra attributes. The `src` attribute should point to the video's url, just like for a normal video element. The `fv-playback-info` attribute should point to the generated `.json` file. Finally you should add the `fv-video` class so the plugin can find your video automatically.

The final thing that needs to be done is to tell Reveal to use the RevealManim plugin. All you need to do is to pass it into the `plugin` field when you're initializing Reveal: 

```
Reveal.initialize({
    ...
    autoPlayMedia: false, //recommended setting, prevents all videos from playing automatically
    plugins: [ ..., RevealManim ]
});
```

Once you've done this you are good to go! There are some more advanced options that you could look into such as animation looping, but this is all you need to add a simple animation to your slides.

## Fragment types

The basic setup that was described in the last section are enough to show a simple animation. If you want more control over how your animations are played during your presentation, such as putting your videos on a loop, then this is a good section to go through. The `end_fragment()` calls that define the video fragments can take an optional argument called `fragment_type`. It can take on a number of values, each of which is quickly described below.

(These fragment types are defined as constants in the `manim_revealjs` package. I.e. `manim_revealjs.NORMAL / LOOP / ...`)

`NORMAL` will play the fragment once from start to end. It's nothing special, but it's probably what you'll be using most of the time.

`LOOP` will continuously loop a fragment from start to end. This is useful when for turntables for example.

`COMPLETE_LOOP` is similar to a normal loop fragment, but there is a difference in how it handles interruptions. If you want to go to the next fragment in the middle of the loop, then this will block that. Instead the loop will go on until it reaches the fragment's end, and only then will the animation continue to play the next fragment. This is useful if you want the transitions between your fragments to be smooth, to prevent your animations from looking chaotic.

`NO_PAUSE` will play the fragment once from start to end like a normal fragment, and then it will immediately go on to the next fragment. This effect can be useful if you want to create an intro for a loop for example.
