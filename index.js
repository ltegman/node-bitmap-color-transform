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

function transformRange(image, transform, start, end) {
  // this method has side effects -- it mutates the image buffer everywhere it
  // is referenced
  for (let i = start; i < end; i += 3) {
    // keep transforms out of function calls to avoid performance hit

    // rgb transform
    if (typeof transform === 'object') {
      let newColors = {
        r: transform.r + image[i],
        g: transform.g + image[i + 1],
        b: transform.b + image[i + 2]
      };

      for (var color in newColors) {
        if (newColors.hasOwnProperty(color)) {
          if (newColors[color] > 255) newColors[color] = 255;
          if (newColors[color] < 0) newColors[color] = 0;
        }
      }

      image[i] = newColors.r;
      image[i + 1] = newColors.g;
      image[i + 2] = newColors.b;
    }

    // color inversion transform
    if (transform === 'invert') {
      image[i] = 255 - image[i];
      image[i + 1] = 255 - image[i + 1];
      image[i + 2] = 255 - image[i + 2];
    }
  }
}

function paletteTransform(image, headers, transform) {
  // avoid mutating passed in buffer
  const newImage = image.slice(0);

  // transform palette
  transformRange(newImage, transform, headers.endOfHeaders,
    headers.pixelOffset);

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
    transformRange(image, transform, colStart, colEnd);
  }

  return newImage;
}
