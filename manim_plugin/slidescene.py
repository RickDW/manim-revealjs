from manim import *

import os
import shutil
import json


config.video_dir= "./video_slides"
config.flush_cache = True
config.disable_caching = True


# TODO test this new implementation
class PresentationScene(Scene):
    def setup(self):
        super().setup()
        self.breaks = [0]
        self.video_slides_dir = config.video_dir
        self.slide_name = type(self).__name__

    def slide_break(self,t=1):
        self.breaks += [self.renderer.time+t/2]
        self.wait(t)

    def save_playback_info(self):
        self.breaks += [self.renderer.time]
        playback_info = {
            "fragments": []
        }
        dirname = os.path.dirname(self.renderer.file_writer.movie_file_path)

        for i in range(len(self.breaks)-1):
            playback_info["fragments"].append({
                "start": self.breaks[i],
                "end": self.breaks[i+1],
                "fragment-type": "normal"
            })

        with open("%s/%s.json" % (dirname, self.slide_name), 'w') as f:
            f.write(json.dump(playback_info))

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
