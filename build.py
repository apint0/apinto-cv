#!/usr/bin/env python3

from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup, escape

ROOT = Path(__file__).parent
CONTENT_DIR = ROOT / "content"
TEMPLATES_DIR = ROOT / "templates"
OUTPUT_FILE = ROOT / "index.html"


def load_content() -> dict:
    """Load every content/*.yaml file into a dict keyed by its name (prefix and extension stripped).

    Files are named "NN-name.yaml", numbered by where they appear on the page
    (00-site.yaml, 01-icons.yaml, 02-hero.yaml, ...) purely so they list in reading
    order in a file browser — sorting the glob preserves that same page order.
    Only the "NN-" prefix is dropped to get the template variable name, e.g.
    "03-experience" -> "experience".
    """
    context = {}
    for path in sorted(CONTENT_DIR.glob("*.yaml")):
        _, _, key = path.stem.partition("-")
        with open(path, encoding="utf-8") as f:
            context[key] = yaml.safe_load(f) or {}
    return context


def highlight_author(text: str, name: str) -> Markup:
    """Wrap `name` in <span class="me"> within an author list, escaping everything else.

    Used as the `highlight` Jinja filter so publications.yaml can store plain author
    strings while the template bolds the CV owner's own name automatically.
    """
    safe_text = str(escape(text))
    safe_name = str(escape(name))
    return Markup(safe_text.replace(safe_name, f'<span class="me">{safe_name}</span>'))


def build() -> None:
    context = load_content()
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html", "j2"]),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    env.filters["highlight"] = highlight_author

    template = env.get_template("index.html.j2")
    html = template.render(**context)
    OUTPUT_FILE.write_text(html, encoding="utf-8")

    n_files = len(list(CONTENT_DIR.glob("*.yaml")))
    print(f"Built {OUTPUT_FILE.name} ({len(html):,} bytes) from {n_files} content files.")


if __name__ == "__main__":
    build()
