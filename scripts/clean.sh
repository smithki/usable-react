#!/usr/bin/env bash

if [ $PKG ] ; then
  lerna exec --scope $PKG -- yarn clean
else
  lerna run clean
fi
