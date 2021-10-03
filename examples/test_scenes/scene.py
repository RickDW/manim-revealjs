import manim as mn


class SquareToCircle(mn.Scene):
    def construct(self):
        circle = mn.Circle()
        circle.set_fill(mn.PINK, opacity=0.5)

        square = mn.Square()
        square.rotate(mn.PI/4)

        self.play(mn.Create(square))
        self.play(mn.Transform(square, circle))
        self.play(mn.FadeOut(square))
        self.wait(duration=0.5)


class Count(mn.Animation):
    def __init__(self, number: mn.DecimalNumber, start: float, end: float,
            **kwargs) -> None:
        super().__init__(number, **kwargs)
        self.start = start
        self.end = end

    def interpolate_mobject(self, alpha: float) -> None:
        value = self.start + alpha * (self.end - self.start)
        self.mobject.set_value(value)


class CountingScene(mn.Scene):
    def construct(self):
        number = mn.DecimalNumber().set_color(mn.WHITE).scale(5)
        number.add_updater(lambda number: number.move_to(mn.ORIGIN))

        self.add(number)
        self.wait()

        self.play(Count(number, 0, 100), run_time=4, rate_func=mn.linear)

        self.wait()


class GradientTest(mn.Scene):
    def construct(self):
        
        sqr = mn.Square()
        sqr.set_fill('url(#linear)')
        self.add(sqr)
        self.wait(2)


class FadeInExample(mn.Scene):
            def construct(self):
                dot = mn.Dot(mn.UP * 2 + mn.LEFT)
                self.add(dot)
                tex = mn.Tex(
                    "FadeIn with ", "shift ", " or target\\_position", " and scale"
                ).scale(1)
                animations = [
                    mn.FadeIn(tex[0]),
                    mn.FadeIn(tex[1], shift=mn.DOWN),
                    mn.FadeIn(tex[2], target_position=dot),
                    mn.FadeIn(tex[3], scale=1.5),
                ]
                self.play(mn.AnimationGroup(*animations, lag_ratio=0.5))


from math import ceil

class StripeTesting(mn.Scene):
    def construct(self):
        slit_width = 0.05
        N = ceil(15/(2*slit_width))
        slits = mn.Group(*[
            mn.Rectangle(
                width=slit_width, height=8.0, fill_color=mn.RED, fill_opacity=1,
                stroke_width=0
            ) for _ in range(N)])
        slits.arrange(mn.RIGHT, buff=slit_width)
        slits.rotate(mn.PI/4)
        # self.add(slits)

        striped_obj = mn.Rectangle(width=3, height=2, fill_color=mn.GREEN, fill_opacity=1,
            stroke_width=0)
        # self.add(striped_obj)

        for slit in slits:
            striped_obj = mn.Difference(striped_obj, slit)

        striped_obj.set_stroke(width=0)
        striped_obj.set_fill(color=mn.GREEN, opacity=1)
        self.add(striped_obj)

        return
        colours = color_gradient(([GREEN] * 10 + [BLUE]*10)*20, 400)
        rect = Rectangle(stroke_width=20, stroke_color = colours, fill_opacity=1.0)
        self.add(rect)
