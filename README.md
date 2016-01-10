# node-bitmap-color-transform

Performs color transformations on bitmap images using node buffers. Currently
supports Windows and OS/2 `.bmp` files with header types of `BM` and `BA`.
Available transforms are an rgb diff in the form of `(30,-20,50)` and color
inversion. Support for more transforms like greyscale are planned.

## CLI

Perform an rgb transform on a file named `test.bmp` and output to `transformed.bmp`:

```
bmptransform test.bmp "-t=(40,12,-60)" -o=transformed.bmp
```

Perform a color inversion on `toinvert.bmp`:
```
bmptransform toinvert.bmp -t=invert -o=inverted.bmp
```

If no output location is specified it will write file named `transformed.bmp` to your current working directory.

## API

#### bitmapTransformer(buffer, transform):
`buffer` is the bitmap as read from disk and `transform` can either be a string (`'invert'`) or an object of rgb diffs (`{r: 30, g: -40, b: 60}`).

Output is a new, transformed `buffer`. The original is not mutated.

```js
const fs = require('fs');
const bitmapTransformer = require('bmp-transform');

fs.readFile('test.bmp', (err, data) => {
  if (err) return console.log(err);

  const transformed = bitmapTransformer(data);

  fs.writeFile('output.bmp', transformed, err => return console.log(err));
});
```

## Known issues

Bitmaps with color depth other than 24 bit or alpha channels are not correctly processed.

## License

This software is licensed under the terms of the MIT license.
