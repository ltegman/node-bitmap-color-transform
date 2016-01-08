'use strict';

const fs = require('fs');
const os = require('os');

fs.readFile('test.BMP', (err, data) => {
  const transformation = {
    r: 5,
    g: 6,
    b: -30
  };
  const headers = getHeaders(data, transformation);
  // return error if not BM type bitmap
  if (headers.type !== 'BM') return console.log('Not a BM type BMP');

  const transformed = bruteTransform(data, headers, transformation);
  fs.writeFile('output.bmp', transformed, function(err) {});
});

function getHeaders(image, transform) {
  const endian = os.endianness();
  const reads = {
    8: 'readUInt8' + endian,
    16: 'readUInt16' + endian,
    32: 'readUInt32' + endian
  };
  const headers = {
    type: image.toString().slice(0,2),
    size: image[reads[32]](2),
    pixelOffset: image[reads[32]](10),
    width: image[reads[32]](18),
    height: image[reads[32]](22),
    bitDepth: image[reads[16]](28)
  };
  headers.rowSize = Math.floor((headers.bitDepth * headers.width + 4) / 32) * 4

  debugger;

  return headers;
}

function bruteTransform(image, headers, transform) {
  // avoid mutating passed in buffer
  const newImage = image.slice(0);

  // transform pixels
  for (let i = headers.pixelOffset; i < newImage.length; i += 3) {
    newImage[i] += transform.r;
    newImage[i+1] += transform.g;
    newImage[i+2] += transform.b;

    for(let i2 = i; i2 < i + 3; i2++) {
      if (newImage[i2] > 255) pixel[i2] = 255;
      if (newImage[i2] < 0) pixel[i2] = 0;
    }
  }

  debugger;

  return newImage;
}
