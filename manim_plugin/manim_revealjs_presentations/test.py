import manim as mn
from presentationscene import PresentationScene, NORMAL, LOOP, \
    COMPLETE_LOOP, NO_PAUSE


class Testing(PresentationScene):
    def construct(self):
        """
        TODO add documentation stating that all construct's must end with a call to end_fragment()
        """
        # TODO find out why end_fragment has the t parameter
        rect = mn.Rectangle(fill_color=mn.BLUE, fill_opacity=1)
        self.add(rect)
        self.end_fragment(fragment_type=NORMAL)
