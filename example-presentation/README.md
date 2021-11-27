## Examples

A few simple files have been prepared to showcase the plugins, which you can find in this directory. To prepare the demo, change the working directory to the `animations` directory, and render the demo animation:

```
manim render demo_scene.py DemoScene
```

This will create the video and the `.json` file containing the timestamps of the video fragments. When Manim has finished rendering everything you will have the following directory structure:

```
example-presentation
|-- animations
    |-- video_slides
        |-- DemoScene.mp4
        |-- DemoScene.json
    |-- demo_scene.py
|-- ...
```

If you now connect to your presentation server through a browser you should see the presentation. (if you're not familiar with this, you can simply run the command `python -m http.server` from the `example-presentation` directory, and then navigate to [localhost:8000](http://localhost:8000) in your browser)