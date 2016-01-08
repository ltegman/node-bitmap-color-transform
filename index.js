'use strict';

const fs = require('fs');
// const os = require('os');
const getHeaders = require(__dirname + '/lib/bitmapHeaders');

fs.readFile('test/resources/test.BMP', (err, data) => {
  if (err) return console.log(err);

  const transformation = {
    r: 5,
    g: 6,
    b: -30
  };
  const headers = getHeaders(data, transformation);
  // return error if not BM type bitmap
  if (headers.type !== 'BM') return console.log('Not a BM type BMP');

  console.log(headers);
  const transformed = bruteTransform(data, headers, transformation);
  fs.writeFile('output.bmp', transformed, () => {});
});

function bruteTransform(image, headers, transform) {
  // avoid mutating passed in buffer
  const newImage = image.slice(0);

  // transform pixels
  for (let i = headers.pixelOffset; i < newImage.length; i += 3) {
    // keep transforms out of function calls to avoid perfromance hit
    if (typeof transform === 'object') {
      newImage[i] += transform.r;
      newImage[i + 1] += transform.g;
      newImage[i + 2] += transform.b;
    }

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
