'use strict';

module.exports = function getArgs(args) {
  const argCopy = Array.prototype.slice.call(args, 0);
  const options = {};

  for (let i = 0; i < argCopy.length; i++) {
    let currArg = argCopy[i];
    // get output argument
    if (currArg.startsWith('-o=')) {
      const value = currArg.split('=')[1];
      options.output = value;
      continue;
    }
    // get file argument
    if (currArg.toLowerCase().endsWith('.bmp')) {
      options.file = currArg;
      continue;
    }
    // get transform argument
    if (currArg.startsWith('-t=')) {
      const value = currArg.split('=')[1];
      options.transform = value;

      // check if it's an rgb set
      value.replace(/\((-?\d+),(-?\d+),(-?\d+)\)/, (match, p1, p2, p3) => {
        if (p1 && p2 && p3) {
          options.transform = {
            r: Number.parseInt(p1, 10),
            g: Number.parseInt(p2, 10),
            b: Number.parseInt(p3, 10)
          };
        }
      });
    }
  }
  return options;
};
