import manim as mn

import os
import shutil
import json


mn.config.video_dir= "./video_slides"
# TODO are the next two settings necessary?
mn.config.flush_cache = True
mn.config.disable_caching = True

NORMAL = "normal"
LOOP = "loop"
COMPLETE_LOOP = "complete_loop"
NO_PAUSE = "no_pause"


class PresentationScene(mn.Scene):
    def setup(self):
        super().setup()
        self.breaks = [0]
        self.fragment_types = []
        self.video_slides_dir = mn.config.video_dir
        self.slide_name = type(self).__name__

    def end_fragment(self, t=0.5, fragment_type=NORMAL):
        self.breaks += [self.renderer.time+t/2]
        self.fragment_types.append(fragment_type)
        self.wait(t)

    def save_playback_info(self):
        playback_info = {
            "fragments": []
        }
        dirname = os.path.dirname(self.renderer.file_writer.movie_file_path)

        print(len(self.breaks), len(self.fragment_types))

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
