# Line Puller

This is simply a small node.js module to read a file line by line in a controlled, imperative way.

## Installation

```bash
$ npm install line-puller --save
```

## How to use

```js
const LinePuller = require('line-puller');

(async function() {

  const lineReader = new LinePuller(__filename);
  lineReader.addFilter( line => line.trim().length > 0 );
  
  await lineReader.skip(1);
  
  for(let line = await lineReader.nextLine(); 
      line !== LinePuller.EOF;
      line = await lineReader.nextLine()) {

    console.log(line);
  }

}());

```

You need to instantiate a LinePuller, passing the filepath or a readableStream as an argument.

There are only three methods available in the LinePuller class: `nextLine` returns, as expected, the next line of the file as a string; `skip` accepts a number and skips that amount of lines; and `addFilter`, which accepts a filter function (as one you would pass to the Array.filter function).

When the LinePuller instance runs out of source lines, it will start returning `LinePuller.EOF` as result from `nextLine` method.

