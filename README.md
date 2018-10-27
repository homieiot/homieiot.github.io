# Website builder

This repository contains the static website generator for the Homie Website.
The build is triggered by a change in any of the Homie specification respositories
and performed by Travis CI. The resulting webpage is uploaded to the gh-pages
branch and served by GitHub.

The generator in use is [mkdocs](https://www.mkdocs.org/).

## Manually generate the webpage
The generator requires python3. For a non-root environment,
it is recommended to create a python virtual environment:

```sh
python3 -m venv dependencies
source dependencies/bin/activate
```

Install the dependencies `gitpython`, `pyyaml`, `mkdocs` and `mkdocs-material`,
then run the versioned-specification-grabber tool and
mkdocs last:

```
pip install -r requirements.txt
./grabrepos.py
mkdocs build
```

## Upload a manually generated webpage

The webpage lives within the "gh-pages" branch. The generated "site" directory
need to be pushed to that branch.

```
cd site
git init
git remote add origin git@github.com:homieiot/website-redesign.git
git add .
git commit -m "Manually generated webpage"
git push origin -f HEAD:gh-pages
```

## Automatically trigger the webpage build

Copy the ".travis.yml" file into the convention specification repository and
add Travis in the repository service settings.

## Theme customisation
The footer of the original mkdocs-material theme is cleared out. For the version
dropdown box, additional css is required. That can be found in `docs/extra.css`.

For changing the color schema, use the `mkdocs.yml` file and find documentation
on https://squidfunk.github.io/mkdocs-material/customization/.

## Quirks

Mkdocs sorts the navigation items by alphabetical name. Sometimes we do not want that
for example the "license" link should appear below all the "convention" documents.
Therefore some directory and files within "docs" have an underscore or a letter in front
of the name for pure sorting reasons.

## Credit
* [mkdocs](https://www.mkdocs.org/)
* [mkdocs-material Theme](https://squidfunk.github.io/mkdocs-material)