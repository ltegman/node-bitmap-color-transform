'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const bitmapHeaders = require(path.join(__dirname, '/../lib/bitmapHeaders'));

describe('bitmapHeaders module', () => {
  before(done => {
    fs.readFile(path.join(__dirname, '/resources/non-palette-bitmap.bmp'),
      (err, data) => {
        if (err) return console.log(err);
        this.headers = bitmapHeaders(data);
        done();
      });
  });

  it('should return a valid header', () => {
    const headers = this.headers;

    expect(headers).to.have.property('type', 'BM');
    expect(headers).to.have.property('size', 30054);
    expect(headers).to.have.property('pixelOffset', 54);
    expect(headers).to.have.property('width', 100);
    expect(headers).to.have.property('height', 100);
    expect(headers).to.have.property('bitDepth', 24);
    expect(headers).to.have.property('rowSize', 300);
  });
});
