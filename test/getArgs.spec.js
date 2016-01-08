const expect = require('chai').expect;
const getArgs = require(__dirname + '/../lib/getArgs');

/* eslint-disable no-unused-expressions */

describe('getArgs module', () => {
  it('should parse word arguments', () => {
    const testArgs = ['node', 'script/location/script.js', '-t=invert',
      'test.bmp'];

    expect(getArgs(testArgs)).to.deep.eql({
      file: 'test.bmp',
      transform: 'invert'
    });
  });

  it('should parse rgb values', () => {
    const testArgs = ['node', 'script/location/script.js', '-t=(40,30,2)',
      'test.bmp'];

    expect(getArgs(testArgs)).to.deep.eql({
      file: 'test.bmp',
      transform: {
        r: 40,
        g: 30,
        b: 2
      }
    });
  });

  it('should parse negative rgb values', () => {
    const testArgs = ['node', 'script/location/script.js', '-t=(-40,30,2)',
      'test.bmp'];

    expect(getArgs(testArgs)).to.deep.eql({
      file: 'test.bmp',
      transform: {
        r: -40,
        g: 30,
        b: 2
      }
    });
  });

  it('should return undefined for invalid args', () => {
    const testArgs = ['node', 'script/location/script.js', 'transform',
      'test.bmp'];

    expect(getArgs(testArgs)).to.be.undefined;
  });
});
