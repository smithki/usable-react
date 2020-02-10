#!/usr/bin/env bash

CLEAN_DIST=true
CLEAN_CACHE=false

set -e
while test $# -gt 0; do
  case "$1" in
    -cache | --cache)
      CLEAN_CACHE=true
      shift
      ;;

    *)
      break
      ;;
  esac
done

if [ $PKG ] ; then
  if [ $CLEAN_DIST = true ]; then lerna exec --scope $PKG -- yarn clean:dist ; fi
  if [ $CLEAN_CACHE = true ]; then lerna exec --scope $PKG -- yarn clean:cache ; fi
else
  if [ $CLEAN_DIST = true ]; then lerna run clean:dist ; fi
  if [ $CLEAN_CACHE = true ]; then lerna run clean:cache ; fi
fi
