'use strict';

const fs = require('fs');
// const os = require('os');
const getHeaders = require(__dirname + '/lib/bitmapHeaders');
const getArgs = require(__dirname + '/lib/getArgs');

const options = getArgs(process.argv);

fs.readFile(__dirname + '/test/' + options.file, (err, data) => {
  if (err) return console.log(err);

  const headers = getHeaders(data);
  // return error if not BM type bitmap
  if (headers.type !== 'BM') return console.log('Not a BM type BMP');
  if (!options) return console.log('Invalid arguments');

  console.log(headers);

  // palette
  let transformed;
  if (headers.pixelOffset - headers.endOfHeaders > 12) {
    transformed = paletteTransform(data, headers, options.transform);
  }
  // non-palette
  if (headers.pixelOffset - headers.endOfHeaders <= 12) {
    transformed = bruteTransform(data, headers, options.transform);
  }

  fs.writeFile('output.bmp', transformed, () => {});
});

function paletteTransform(image, headers, transform) {
  // avoid mutating passed in buffer
  const newImage = image.slice(0);

  // transform palette
  for (let i = headers.endOfHeaders; i < headers.pixelOffset; i += 3) {
    // keep transforms out of function calls to avoid perfromance hit

    // rgb transform
    if (typeof transform === 'object') {
      let newColors = {
        r: transform.r + newImage[i],
        g: transform.g + newImage[i + 1],
        b: transform.b + newImage[i + 2]
      };

      for (var color in newColors) {
        if (newColors.hasOwnProperty(color)) {
          if (newColors[color] > 255) newColors[color] = 255;
          if (newColors[color] < 0) newColors[color] = 0;
        }
      }

      newImage[i] = newColors.r;
      newImage[i + 1] = newColors.g;
      newImage[i + 2] = newColors.b;
    }

    // color inversion transform
    if (transform === 'invert') {
      newImage[i] = 255 - newImage[i];
      newImage[i + 1] = 255 - newImage[i + 1];
      newImage[i + 2] = 255 - newImage[i + 2];
    }

    for (let i2 = i; i2 < i + 3; i2++) {
      if (newImage[i2] > 255) newImage[i2] = 255;
      if (newImage[i2] < 0) newImage[i2] = 0;
    }
  }

  return newImage;

}

function bruteTransform(image, headers, transform) {
  // avoid mutating passed in buffer
  const newImage = image.slice(0);

  // transform pixels
  for (let i = headers.pixelOffset; i < newImage.length; i += 3) {
    // keep transforms out of function calls to avoid perfromance hit

    // rgb transform
    if (typeof transform === 'object') {
      let newColors = {
        r: transform.r + newImage[i],
        g: transform.g + newImage[i + 1],
        b: transform.b + newImage[i + 2]
      };

      for (var color in newColors) {
        if (newColors.hasOwnProperty(color)) {
          if (newColors[color] > 255) newColors[color] = 255;
          if (newColors[color] < 0) newColors[color] = 0;
        }
      }

      newImage[i] = newColors.r;
      newImage[i + 1] = newColors.g;
      newImage[i + 2] = newColors.b;
    }

    // color inversion transform
    if (transform === 'invert') {
      newImage[i] = 255 - newImage[i];
      newImage[i + 1] = 255 - newImage[i + 1];
      newImage[i + 2] = 255 - newImage[i + 2];
    }

    for (let i2 = i; i2 < i + 3; i2++) {
      if (newImage[i2] > 255) newImage[i2] = 255;
      if (newImage[i2] < 0) newImage[i2] = 0;
    }
  }

  return newImage;
}
