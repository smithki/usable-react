#!/usr/bin/env bash

CLEAN_DIST=true
CLEAN_CACHE=false

set -e
while test $# -gt 0; do
  case "$1" in
    -c | --cache)
      CLEAN_CACHE=true
      shift
      ;;

    *)
      break
      ;;
  esac
done

printMessage() {
  echo
  echo "🧼  Cleaning up $1 for $2..."
  echo
}

if [ $PKG ] ; then
  if [ $CLEAN_DIST = true ]; then printMessage "dist files" "\`$PKG\`" && lerna exec --scope $PKG -- yarn clean:dist ; fi
  if [ $CLEAN_CACHE = true ]; then printMessage "caches" "\`$PKG\`" && lerna exec --scope $PKG -- yarn clean:cache ; fi
else
  if [ $CLEAN_DIST = true ]; then printMessage "dist files" "all packages" && lerna run clean:dist ; fi
  if [ $CLEAN_CACHE = true ]; then printMessage "caches" "all packages" && lerna run clean:cache ; fi
fi
