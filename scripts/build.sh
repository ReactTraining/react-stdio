#!/bin/bash

mkdir -p build

tag=${TRAVIS_TAG:-"v$npm_package_version"}

# TODO: Enable x86 builds when https://github.com/zeit/pkg/issues/310 is fixed
platforms=( win-x64 linux-x64 macos )

for platform in "${platforms[@]}"
do
  archive=react-stdio-$tag-$platform

  echo "Creating $archive build..."

  pkg modules/cli.js -t $platform -o build/$archive/react-stdio
  echo "$tag" > build/$archive/version

  cd build
  zip -q -r $archive.zip $archive
  cd - > /dev/null
done
