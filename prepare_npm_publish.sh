#!/usr/bin/env sh

rm -rf dist/test
rm -f dist/jest.*
chmod +x dist/bin/npb.js
cp LICENSE dist
cp Readme.md dist
