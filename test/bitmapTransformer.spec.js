'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const bitmapTransformer = require(path.join(__dirname,
  '../lib/bitmapTransformer'));
const bitmapHeaders = require(path.join(__dirname, '../lib/bitmapHeaders'));
// helper method to pull colors for testing
function getRGB(image, offset) {
  return {
    r: image[offset],
    g: image[offset + 1],
    b: image[offset + 2]
  };
}

describe('bitmapTransformer module', () => {
  describe('paletteTransform', () => {
    beforeEach((done) => {
      fs.readFile(path.join(__dirname, 'resources/palette-bitmap.bmp'),
        (err, data) => {
          if (err) console.log(err);
          this.image = data;
          this.headers = bitmapHeaders(data);
          done();
        });
    });
    it('should perform an rgb transform', () => {
      const transformed = bitmapTransformer(this.image, {r: 20, g: 20, b: 20});
      const beforeRGB = getRGB(this.image, this.headers.endOfHeaders);
      const afterRGB = getRGB(transformed, this.headers.endOfHeaders);
      Object.keys(afterRGB).forEach(color => {
        assert(afterRGB[color] === beforeRGB[color] + 20 ||
          afterRGB[color] === 255);
      });
    });
    it('should perform a color inversion', () => {
      const transformed = bitmapTransformer(this.image, 'invert');
      const beforeRGB = getRGB(this.image, this.headers.endOfHeaders);
      const afterRGB = getRGB(transformed, this.headers.endOfHeaders);
      Object.keys(afterRGB).forEach(color => {
        assert(afterRGB[color] === 255 - beforeRGB[color]);
      });
    });
  });

  describe('bruteTransform', () => {
    beforeEach((done) => {
      fs.readFile(path.join(__dirname, 'resources/non-palette-bitmap.bmp'),
        (err, data) => {
          if (err) console.log(err);
          this.image = data;
          this.headers = bitmapHeaders(data);
          done();
        });
    });
    it('should perform an rgb transform', () => {
      const transformed = bitmapTransformer(this.image, {r: 20, g: 20, b: 20});
      const beforeRGB = getRGB(this.image, this.headers.pixelOffset);
      const afterRGB = getRGB(transformed, this.headers.pixelOffset);
      Object.keys(afterRGB).forEach(color => {
        assert(afterRGB[color] === beforeRGB[color] + 20 ||
          afterRGB[color] === 255);
      });
    });
    it('should perform a color inversion', () => {
      const transformed = bitmapTransformer(this.image, 'invert');
      const beforeRGB = getRGB(this.image, this.headers.pixelOffset);
      const afterRGB = getRGB(transformed, this.headers.pixelOffset);
      Object.keys(afterRGB).forEach(color => {
        assert(afterRGB[color] === 255 - beforeRGB[color]);
      });
    });
  });

  describe('BA type transform', () => {
    beforeEach((done) => {
      fs.readFile(path.join(__dirname, 'resources/spade.bmp'),
        (err, data) => {
          if (err) console.log(err);
          this.image = data;
          this.headers = bitmapHeaders(data);
          done();
        });
    });
    it('should perform an rgb transform', () => {
      const transformed = bitmapTransformer(this.image, {r: 20, g: 20, b: 20});
      const beforeRGB = getRGB(this.image, this.headers.endOfHeaders);
      const afterRGB = getRGB(transformed, this.headers.endOfHeaders);
      Object.keys(afterRGB).forEach(color => {
        assert(afterRGB[color] === beforeRGB[color] + 20 ||
          afterRGB[color] === 255);
      });
    });
    it('should perform a color inversion', () => {
      const transformed = bitmapTransformer(this.image, 'invert');
      const beforeRGB = getRGB(this.image, this.headers.endOfHeaders);
      const afterRGB = getRGB(transformed, this.headers.endOfHeaders);
      Object.keys(afterRGB).forEach(color => {
        assert(afterRGB[color] === 255 - beforeRGB[color]);
      });
    });
  });
});
