import manim as mn

import os
import shutil
import json


NORMAL = "normal"
LOOP = "loop"
COMPLETE_LOOP = "complete_loop"
NO_PAUSE = "no_pause"

# this is needed to make sure that the files are generated again when the 
# end_fragment() calls are changed but not the animation itself.
# TODO look into making this more efficient?
mn.config.flush_cache = True
mn.config.disable_caching = True


class PresentationScene(mn.Scene):
    """
    Provides an interface that allows you to divide a Scene into fragments.

    You can use PresentationScene just like a normal Scene, i.e. by subclassing
    it. The only difference is that you can separate the scene into several
    fragments. This makes it a lot easier to show specific parts of your
    animation in reveal.js.

    You separate fragments by calling self.end_fragment() in your scene's
    construct() function definition. This will denote the end of the current
    fragment, and the start of a new fragment if the end of the scene has not
    been reached. 
    
    IMPORTANT: every scene definition, i.e. every construct() function, needs
    to call self.end_fragment() after all animations have finished. If you do
    not do this your animation will still be rendered in full, but the
    javascript plugin will not play the final fragment of your scene.

    A simple overview of the behaviour of the fragment types:
    - NORMAL: during your presentation the video will pause at the end of a
    NORMAL fragment.
    - LOOP: once the video reaches the end of this fragment, it will jump back
    to the start of the fragment. It will keep playing until it is interrupted.
    - COMPLETE_LOOP: this fragment's behaviour is similar to that of a LOOP
    fragment, but if you try to continue to the next fragment the current 
    fragment will be played until the end before going on to the next fragment.
    This is a nice type if you want a smooth transition between a LOOP fragment
    and the next one.
    - NO_PAUSE: this fragment type will be played once. The next fragment will
    be played immediately once this one is finished. You can use this if you
    want to have a fragment that introduces a looping fragment for example. The
    intro is not a part of the loop and will thus not be repeated, but you do
    not have to manually start the loop fragment.

    """
    def setup(self):
        super().setup()
        self.breaks = [0]
        self.fragment_types = []
        self.video_slides_dir = mn.config.video_dir
        self.slide_name = type(self).__name__

    def end_fragment(self, t=0.5, fragment_type=NORMAL):
        """
        Marks the end of the current fragment and define its type.

        Calling this function from within construct() will end the current
        fragment. If necessary, you can specify the type of the previous
        fragment, i.e. NORMAL (default), LOOP, COMPLETE_LOOP, or NO_PAUSE.
        """
        self.breaks += [self.renderer.time+t/2]
        self.fragment_types.append(fragment_type)
        self.wait(t)

    def save_playback_info(self):
        playback_info = {
            "fragments": []
        }
        dirname = os.path.dirname(self.renderer.file_writer.movie_file_path)

        for i in range(1, len(self.breaks)):
            playback_info["fragments"].append({
                "start": self.breaks[i-1],
                "end": self.breaks[i],
                "fragment-type": self.fragment_types[i-1]
            })

        with open("%s/%s.json" % (dirname, self.slide_name), 'w') as f:
            json.dump(playback_info, f)

    def copy_files(self):
        if self.video_slides_dir != None:
            dirname=os.path.dirname(self.renderer.file_writer.movie_file_path)
            if not os.path.exists(self.video_slides_dir):
                os.makedirs(self.video_slides_dir)
            shutil.copy2(os.path.join(dirname,"%s.mp4" % self.slide_name), self.video_slides_dir)
            shutil.copy2(os.path.join(dirname,"%s.json" % self.slide_name), self.video_slides_dir)

    def tear_down(self):
        super().tear_down()
        self.save_playback_info()

    def print_end_message(self):
        super().print_end_message()
        self.copy_files()
