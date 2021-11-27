import os
import shutil


def export(directory=None, name="manim.js"):
    """
    Create a copy of the javascript plugin in the given directory.

    You can optionally specify a new name for the script, but it will default
    to "manim.js".
    """
    plugin_directory = os.path.dirname(os.path.realpath(__file__))
    plugin_file = os.path.join(plugin_directory, "manim.js")

    if directory is None:
        directory = os.getcwd()

    # the path to the copy
    target = os.path.join(directory, name)

    shutil.copyfile(plugin_file, target)