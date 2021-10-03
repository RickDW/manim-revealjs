# [WIP] Manim and Reveal.js plugins for using mathematical animations in your slides

This repository contains the required plugins to use the beautiful mathematical animations that are made possible by [Manim](https://www.manim.community) in presentation slides made with [Reveal.js](https://github.com/hakimel/reveal.js). Manim was originally created by Grant Sanderson from the Youtube channel [3B1B](https://www.youtube.com/c/3blue1brown) which is well known its pretty and clear mathematical animations.

(This is a fork of [manim_slides](https://github.com/chubbc/manim_slides) which itself is a fork of [manim_reveal](https://github.com/anjandn/manim_reveal))

At the moment this repository is a complete work in progress and you probably won't get much use out of it. Updates are expected in the next few weeks.

## How to use the plugins

To add Manim animations to your presentation you first need to render them. In order to make the integration with Reveal.js as smooth as possible you can use the Manim plugin's `PresentationScene`. There are no major differences with the normal `Scene` that you're used to, except for the `PresentationScene`'s `end_fragment`() method. If this method is called in the scene's `construct`() method it means there will be a pause in the animation when it is displayed in the slide deck. **Important:** every `construct`() you define **needs** to end with an `end_fragment`() call to correctly handle the animation.

Once the animations have been rendered, you can link them in your slide deck. Here you have two options: either you display the animations fullscreen as the background of a slide, or you add them along with the rest of the objects in your slides.

If you want to go for the first option, the slide's `<section>` should be given the `fv-background` class (short for *fragmented video class*). Next you need to set its `fv-video` attribute to the video's url, and its `fv-playback-info` attribute to the url of the `.json` file that was generated when you rendered the video. (This last file contains the timestamps of the different fragments of your video).

If you want to go for the second option of embedding your video like any other slide content, you can simply add a `<vid>` element with some extra attributes. The `src` attribute should point to the video's url, just like for a normal video element. The `fv-playback-info` attribute should point to the generated `.json` file. Finally you should add the `fv-video` class so the plugin can find your video automatically.

The final thing that needs to be done is to tewl Reveal to use the RevealManim plugin. All you need to do is to pass it into the `plugin` field when you're initializing Reveal: 

```
Reveal.initialize({
    ...
    autoPlayMedia: false, //recommended setting, no need to worry about it
    plugins: [ ..., RevealManim ]
});
```

Once you've done this you should be good to go! There are some more advanced options that you could look into such as animation looping *(WIP)*, but this is all you need to add a simple animation to your slides.