from manim_revealjs import *

class Title(SlideScene):
    def construct(self):
        title = Tex(r"\bfseries\textsc{Manim\_slides example}").scale(1.25).shift(2.5*UP)
        arxiv = Tex(r"\bfseries\texttt{arXiv:????.?????}").scale(.75).shift(1.5*UP)
        name = Tex("Christopher T.\ Chubb")
        
        self.add(title,arxiv,name)

        self.play(*[FadeOut(x) for x in [title,arxiv,name]],run_time=0.5)
        self.wait(0.5)
        
class ExampleSlide(SlideScene):
    def construct(self):
        circle = Circle(radius=1, color=BLUE)
        dot = Dot()
        dot2 = dot.copy().shift(RIGHT)
        self.add(dot)

        line = Line([3, 0, 0], [5, 0, 0])
        self.add(line)

        self.play(GrowFromCenter(circle))
        self.slide_break()
        self.play(Transform(dot, dot2))
        self.slide_break()
        self.play(MoveAlongPath(dot, circle), run_time=2, rate_func=linear)
        self.slide_break()
        self.play(Rotating(dot, about_point=[2, 0, 0]), run_time=1.5)
        self.wait()

