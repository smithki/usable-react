#!/usr/bin/env bash

if [ $PKG ] ; then
  echo
  echo "📦  Building \`$PKG\` and it's dependencies for production..."
  echo

  lerna exec --scope $PKG --include-dependencies -- yarn build
else
  echo
  echo "📦  Building all packages for production..."
  echo

  lerna run build
fi
