# Origami-Fortune-Teller
This is our final project.  

<br>

## JSDocs Integration

JSDocs is implemented via GitHub Actions, where [JSDoc Action](https://github.com/andstor/jsdoc-action) is used to build and [GitHub Pages Deploy Action](https://github.com/JamesIves/github-pages-deploy-action) is used to deploy. Every time the `main` branch gets pushed, a GitHub pages webpage is automatically created. The contents of the webpage is deployed on another branch called `gh-pages-docs`, which is created by the workflow `jsdocs.yml`. By doing this, we can deploy a GitHub Pages webpage on the `gh-pages-docs` branch.

To contribute, see our [contributor guide](CONTRIBUTING.md).
