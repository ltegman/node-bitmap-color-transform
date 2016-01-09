'use strict';

const os = require('os');

module.exports = function getHeaders(image) {
  const endian = os.endianness();
  const reads = {
    8: 'readUInt8' + endian,
    16: 'readUInt16' + endian,
    32: 'readUInt32' + endian
  };
  const type = image.toString().slice(0, 2);

  let headers;

  if (type === 'BM') headers = getBMHeader(image, type, reads);
  if (type === 'BA') headers = getBAHeader(image, type, reads);

  return headers;
};

function getBMHeader(image, type, reads) {
  const headers = {
    type: type,
    size: image[reads[32]](2),
    pixelOffset: image[reads[32]](10),
    width: image[reads[32]](18),
    height: image[reads[32]](22),
    bitDepth: image[reads[16]](28),
    endOfHeaders: 14 + image[reads[32]](14)
  };

  headers.rowSize = Math.floor((headers.bitDepth * headers.width + 4) / 32) * 4;

  return headers;
}

function getBAHeader(image, type, reads) {
  const headers = {
    type: type,
    size: image[reads[32]](2),
    pixelOffset: image[reads[32]](24),
    width: image[reads[16]](32),
    height: image[reads[16]](36),
    endOfHeaders: image[reads[32]](2)
  };

  return headers;
}
