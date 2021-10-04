## Examples

A few simple files have been prepared to showcase the plugins, which you can find in the `showcase` directory. To prepare the demo, change the working directory to the `showcase` directory, and execute the following command:

```
manim render demo_scene.py DemoScene
```

This will create the video and the `.json` file containing the timestamps of the video fragments. Assuming you have set up a local server for Revealjs already, you can copy the `demo_slides.html` file and the entire `video-slides` directory to the server's presentation directory.  This should result in the following structure:

```
reveal-js
|-- video_slides
    |-- DemoScene.mp4
    |-- DemoScene.json
|-- demo_slides.html
|-- ...
```

If you now connect to your presentation server through a browser you should see the presentation.