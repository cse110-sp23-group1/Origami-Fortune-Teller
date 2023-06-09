## Setup
1. Install node.js and npm (note: npm should be included in node)
2. Run command `npm ci` to grab the dependencies you need

<br>

## Run the linter
- `lint-check` looks for style flaws anywhere in the git
- `lint-fix` same as above, but also tries to fix the flaws
- `npx eslint ./path/to/yourWork.js` to check a specific directory/file
- `npx --fix eslint ./path/to/yourWork.js` to try to fix a specific directory/file

<br>

## JSDoc Formatting
- Use [this](https://jsdoc.app/about-getting-started.html) link to familiarize yourself with JSDoc syntax
- For classes and functions, give a description on what it does
- For constructors, use the JSDoc tag `@constructor` in the JSDoc formatted comment
- Use `@param` and `@return` when necessary
