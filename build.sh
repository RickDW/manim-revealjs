source venv/bin/activate
manim_revealjs_version=0.0.3
python -m build
python -m twine upload dist/*$manim_revealjs_version*