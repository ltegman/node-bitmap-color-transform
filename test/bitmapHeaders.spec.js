const expect = require('chai').expect;
const fs = require('fs');
const bitmapHeaders = require(__dirname + '/../lib/bitmapHeaders');

describe('bitmapHeaders module', () => {
  before(done => {
    fs.readFile(__dirname + '/resources/test.BMP', (err, data) => {
      if (err) return console.log(err);
      this.headers = bitmapHeaders(data);
      done();
    });
  });
  it('should returns a valid header', () => {
    const headers = this.headers;

    expect(headers).to.have.property('type', 'BM');
    expect(headers).to.have.property('size', 46182);
    expect(headers).to.have.property('pixelOffset', 54);
    expect(headers).to.have.property('width', 124);
    expect(headers).to.have.property('height', 124);
    expect(headers).to.have.property('bitDepth', 24);
    expect(headers).to.have.property('rowSize', 372);
  });
});
