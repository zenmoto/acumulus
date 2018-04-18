#!/bin/sh

echo $NODE_TOKEN >> .npmrc
npm publish
