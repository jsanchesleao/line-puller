const fs = require('fs');

function milliseconds(ms) {
  return new Promise(function(resolve, _) {
    setTimeout(resolve, ms);
  });
}

class LinePuller {

  constructor(input) {
    this.reader = input.constructor === fs.ReadStream ? input : fs.createReadStream(input);
    this.readData = '';
    this.nextLines = [];
    this.filters = [];
  }

  addFilter(filterFunction) {
    this.filters.push(filterFunction);
  }

  async skip(amount) {
    for (let i = 0; i < amount; i++) {
      await this.nextLine();
    }
  }

  async nextLine() {
    if(this.nextLines.length > 0) {
      const [line, ...rest] = this.nextLines;
      this.nextLines = rest;
      
      return line;
    }
    else if (this.reader.closed) {
      return LinePuller.EOF;
    }
    else if (this.reader.readableLength === 0) {
      await milliseconds(10);
      return this.nextLine();
    }
    else {
      const dataRead = this.reader.read(64);
      if (dataRead === null) {
        this.nextLines.push(this.readData);
        this.readData = null;
      }
      else {
        const textChunk = this.readData + dataRead.toString('utf-8');
        const chunkedLines = textChunk.split('\n');
        this.readData = chunkedLines[chunkedLines.length - 1];
        this.nextLines = chunkedLines.slice(0, -1);
      }

      this.nextLines = this.filters.reduce(
        (lines, filter) => lines.filter(filter), 
        this.nextLines);

      return this.nextLine();
    }
  }

}

LinePuller.EOF = Symbol('EOF');

module.exports = LinePuller;