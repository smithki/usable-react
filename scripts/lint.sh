#!/usr/bin/env bash

if [ $PKG ] ; then
  echo
  echo "🔎  Linting \`$PKG\` and it's dependencies..."
  echo

  lerna exec --scope $PKG -- yarn lint
else
  echo
  echo "🔎  Linting all packages..."
  echo

  lerna run lint
fi
