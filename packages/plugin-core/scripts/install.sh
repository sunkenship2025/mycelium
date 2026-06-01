#!/bin/bash

version=`cat package.json | jq ".version" -r`
name="mycelium"
code-insiders --install-extension "$name-$version.vsix" --force
codium --install-extension "$name-$version.vsix" --force
