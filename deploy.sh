#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

touch .nojekyll

# create new git repo
git init
git add -A
git commit -m 'deploy'

# push to github pages
git push -f https://github.com/i74n/canvas-chart-transform.git master:gh-pages

cd -