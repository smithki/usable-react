#!/usr/bin/env bash

if [ $PKG ] ; then
  lerna exec --scope $PKG -- yarn build
else
  lerna run build
fi
