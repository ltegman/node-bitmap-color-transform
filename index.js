'use strict';

const fs = require('fs');
// const os = require('os');
const getHeaders = require(__dirname + '/lib/bitmapHeaders');
const getArgs = require(__dirname + '/lib/getArgs');

const options = getArgs(process.argv);

fs.readFile(__dirname + '/' + options.file, (err, data) => {
  if (err) return console.log(err);

  const headers = getHeaders(data);
  // return error if not BM or BA type bitmap
  if (headers.type !== 'BM' && headers.type !== 'BA') {
    return console.log('Not a BM or BA type BMP');
  }
  if (!options) {
    return console.log('Invalid arguments: Please specify a file' +
      ' location and transformation');
  }

  console.log(headers);

  // palette
  let transformed;
  if (headers.pixelOffset - headers.endOfHeaders > 12 ||
      headers.type === 'BA') {
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
  }

  return newImage;

}

function bruteTransform(image, headers, transform) {
  // avoid mutating passed in buffer
  const newImage = image.slice(0);

  // transform pixels
  // nested loop is necessary to handle rows with padding at the end
  for (let row = 0; row < headers.height; row++) {
    let colStart = headers.pixelOffset + (row * headers.rowSize);
    let colEnd = colStart + headers.rowSize;
    for (let col = colStart; col < colEnd; col += 3) {
      // keep transforms out of function calls to avoid perfromance hit

      // rgb transform
      if (typeof transform === 'object') {
        let newColors = {
          r: transform.r + newImage[col],
          g: transform.g + newImage[col + 1],
          b: transform.b + newImage[col + 2]
        };

        for (var color in newColors) {
          if (newColors.hasOwnProperty(color)) {
            if (newColors[color] > 255) newColors[color] = 255;
            if (newColors[color] < 0) newColors[color] = 0;
          }
        }

        newImage[col] = newColors.r;
        newImage[col + 1] = newColors.g;
        newImage[col + 2] = newColors.b;
      }

      // color inversion transform
      if (transform === 'invert') {
        newImage[col] = 255 - newImage[col];
        newImage[col + 1] = 255 - newImage[col + 1];
        newImage[col + 2] = 255 - newImage[col + 2];
      }
    }
  }

  return newImage;
}
