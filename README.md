# Adriano Pinto — Curriculum Vitae

A clean, single-page personal CV site — Machine Learning / Artificial Intelligence &amp; Medical Imaging.

**Live site:** https://apint0.github.io/apinto-cv/

## About
Welcome to my bio :) It presents my professional experience, education, scientific activities, key
publications, open-source projects, and certificates. Designed to be linked
from my LinkedIn profile.

`index.html` is a **build product** — generated from the content and
templates below. Don't hand-edit it; edit the source and rebuild instead.

## How it's built

```
content/        One YAML file per section, numbered by page order — this is what you edit.
templates/      Jinja2 templates that turn content/ into HTML.
static/         style.css and script.js, served as-is (not templated).
assets/         Images (profile photo, etc.), served as-is.
build.py        Reads content/ + templates/, writes index.html.
pyproject.toml  Build dependencies (Jinja2, PyYAML), managed by uv.
index.html      Generated output — committed so GitHub Pages needs no build step.
```

Editing a bullet point, a job title, a publication, or a skill chip means
editing a YAML file, not the HTML. The page layout, CSS, and JS live in
`templates/` and `static/` and rarely need to change.

## Editing content

1. Install [uv](https://docs.astral.sh/uv/) (one-time, if you don't have it):
   ```
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
   `uv` manages the build dependencies (Jinja2, PyYAML) in a local `.venv/`
   from `pyproject.toml` / `uv.lock` — no manual venv setup needed.
2. Edit the relevant file under `content/`. Files are numbered by where they
   appear on the page, top to bottom:

   | File | Section |
   |---|---|
   | `00-site.yaml` | Page title/meta, nav & section order, GitHub username |
   | `01-icons.yaml` | Shared SVG icon paths used across sections |
   | `02-hero.yaml` | Name, tagline, summary text, profile links |
   | `03-experience.yaml` | Industry / Academia timeline |
   | `04-education.yaml` | Degree cards |
   | `05-activities.yaml` | Scientific activities list |
   | `06-publications.yaml` | Journal & conference publications |
   | `07-projects.yaml` | GitHub live-fetch settings (repo list itself is not stored — see below) |
   | `08-certificates.yaml` | Certificate cards |
   | `09-skills.yaml` | Programming, strengths, interests, languages |

   The numeric prefix is stripped when the file is loaded, so `03-experience.yaml`
   is still referred to as `experience` in templates — renumbering a file (or
   adding a new section between two existing ones, e.g. `03a-...`) never breaks
   anything.

   Most fields are plain text and are automatically HTML-escaped. A field
   named `..._html` (e.g. `body_html`, `text_html`) is raw HTML — escape
   entities yourself there (`&amp;`, not `&`) since it bypasses escaping.

3. Rebuild:
   ```
   uv run build.py
   ```
4. Commit both the `content/*.yaml` change and the regenerated `index.html`.


---
