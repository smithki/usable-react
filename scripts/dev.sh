#!/usr/bin/env bash

if [ $PKG ] ; then
  lerna exec --scope $PKG -- yarn dev
else
  lerna run dev
fi
