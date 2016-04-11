'use strict';

const os = require('os');

module.exports = function getHeaders(image) {
  const endian = os.endianness();
  const read = {
    UInt8: 'readUInt8',
    UInt16: 'readUInt16' + endian,
    UInt32: 'readUInt32' + endian
  };
  const type = image.toString().slice(0, 2);

  let headers;

  if (type === 'BM') headers = getBMHeader(image, type, read);
  if (type === 'BA') headers = getBAHeader(image, type, read);

  return headers;
};

function getBMHeader(image, type, read) {
  const headers = {
    type: type,
    size: image[read.UInt32](2),
    pixelOffset: image[read.UInt32](10),
    width: image[read.UInt32](18),
    height: image[read.UInt32](22),
    bitDepth: image[read.UInt16](28),
    endOfHeaders: 14 + image[read.UInt32](14)
  };

  headers.rowSize = Math.floor((headers.bitDepth * headers.width + 4) / 32) * 4;

  return headers;
}

function getBAHeader(image, type, read) {
  const headers = {
    type: type,
    pixelOffset: image[read.UInt32](24),
    width: image[read.UInt16](32),
    height: image[read.UInt16](36),
    endOfHeaders: image[read.UInt32](2)
  };

  return headers;
}
