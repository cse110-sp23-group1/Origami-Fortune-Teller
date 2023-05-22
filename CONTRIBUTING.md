## Setup
1. Install node.js and npm (note: npm should be included in node)
2. Run command `npm ci` to grab the dependencies you need

<br>

## Run the linter
- `lint-check` looks for style flaws anywhere in the git
- `lint-fix` same as above, but also tries to fix the flaws
- `npx eslint ./path/to/yourWork.js` to check a specific directory/file
- `npx --fix eslint ./path/to/yourWork.js` to try to fix a specific directory/file