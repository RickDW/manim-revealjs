source venv/bin/activate
manim_revealjs_version=0.0.3
# to install these scripts, run `pip install --upgrade build twine``
python -m build
python -m twine upload dist/*$manim_revealjs_version*