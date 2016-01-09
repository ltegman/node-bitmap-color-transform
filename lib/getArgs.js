'use strict';

module.exports = function getArgs(args) {
  const argCopy = Array.prototype.slice.call(args, 2);
  const options = {};

  while (argCopy.length > 0) {
    // this is used to make sure we popped an arg so we can stop infinite loops
    let currArg = argCopy[0];
    // get file argument
    if (argCopy[0].toLowerCase().endsWith('.bmp')) {
      options.file = argCopy.shift();
      continue;
    }
    // get transform argument
    if (argCopy[0].startsWith('-t=')) {
      const arg = argCopy.shift();
      const value = arg.split('=')[1];
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
    // make sure we don't get into an infinite loop
    if (currArg === argCopy[0]) {
      return console.log('invalid arguments');
    }
  }
  return options;
};
