#!/usr/bin/env bash

if [ $PKG ] ; then
  lerna exec --scope $PKG -- yarn lint
else
  lerna run lint
fi
