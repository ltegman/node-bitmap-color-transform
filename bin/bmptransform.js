#! /usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const getHeaders = require(path.join(__dirname, '../lib/bitmapHeaders'));
const getArgs = require(path.join(__dirname, '../lib/getArgs'));
const bitmapTransformer = require(path.join(__dirname,
  '../lib/bitmapTransformer'));

const options = getArgs(process.argv);
const output = options.output || 'transformed.bmp';

if (!options.file || !options.transform) {
  return console.log('Must pass a valid .bmp file and transform');
}

fs.readFile(path.resolve(process.cwd(), options.file), (err, data) => {
  if (err) return console.log(err);

  if (!options) {
    return console.log('Invalid arguments: Please specify a file' +
      ' location and transformation');
  }

  const transformed = bitmapTransformer(data, options.transform);
  const headers = getHeaders(data);

  console.log(headers);

  fs.writeFile(path.resolve(process.cwd(), output), transformed, () => {});
});
