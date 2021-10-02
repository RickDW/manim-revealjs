from manim import *

import os
import shutil


config.video_dir= "./video_slides"
config.flush_cache = True
config.disable_caching = True


class SlideScene(Scene):
    breaks=[0]
    video_slides_dir="./video_slides"
    def setup(self):
        super(SlideScene, self).setup()
        self.breaks=[0]

    def slide_break(self,t=0.5):
        self.breaks+=[self.renderer.time+t/2]
        self.wait(t)

    def save_times(self):
        self.breaks+=[self.renderer.time]
        out=""
        dirname=os.path.dirname(self.renderer.file_writer.movie_file_path)
        for i in range(len(self.breaks)-1):
            out+=f"<p class=\"fragment\" type='video' time_start={self.breaks[i]} time_end={self.breaks[i+1]}></p>\n"
        with open("%s/%s.txt"%(dirname,type(self).__name__),'w') as f:
            f.write(out)

    def copy_files(self):
        if self.video_slides_dir !=None:
            dirname=os.path.dirname(self.renderer.file_writer.movie_file_path)
            slide_name = type(self).__name__
            if not os.path.exists(self.video_slides_dir):
                os.makedirs(self.video_slides_dir)
            shutil.copy2(os.path.join(dirname,"%s.mp4"%slide_name), self.video_slides_dir)
            shutil.copy2(os.path.join(dirname,"%s.txt"%slide_name), self.video_slides_dir)

    def tear_down(self):
        super(SlideScene, self).tear_down()
        self.save_times()

    def print_end_message(self):
        super(SlideScene, self).print_end_message()
        self.copy_files()
