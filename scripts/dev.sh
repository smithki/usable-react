#!/usr/bin/env bash

if [ $PKG ] ; then
  echo
  echo "📦  Building dependencies..."
  echo

  DEPS=$(lerna ls --scope $PKG --include-dependencies | grep -v $PKG | xargs -n1 echo '--scope')
  lerna exec $DEPS -- yarn build # Build dependencies first

  echo
  echo "🏗  Building \`$PKG\` for development..."
  echo

  lerna exec --scope $PKG -- yarn dev
else
  echo
  echo "⚠️  Please specify a value for the \$PKG variable before running \`yarn dev\`"
  echo "   Like this: \`PKG=@usable-react/[hook-name] yarn dev\`"
  echo
  exit 1
fi
