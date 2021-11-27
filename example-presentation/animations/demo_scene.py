import manim as mn
from manim_revealjs import PresentationScene, COMPLETE_LOOP


mn.config.video_dir= "./videos"

class DemoScene(PresentationScene):
    def construct(self):
        # TODO find out why end_fragment has the t parameter
        rect = mn.Rectangle(fill_color=mn.BLUE, fill_opacity=1)
        self.play(mn.Create(rect))
        self.end_fragment()

        self.play(rect.animate.shift(mn.UP).rotate(mn.PI / 3))
        self.end_fragment(fragment_type=COMPLETE_LOOP)

        self.play(rect.animate.shift(3*mn.LEFT))
        self.end_fragment()
