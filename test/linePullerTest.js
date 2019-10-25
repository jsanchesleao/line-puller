const assert = require('assert');
const path = require('path');
const fs = require('fs');
const LinePuller = require('../');

describe('Reading', function() {

  it('setup and reading', async function() {
    const reader = new LinePuller(path.join(__dirname, '..', 'test-assets', 'lines.txt'));
    const firstLine = await reader.nextLine();
    const secondLine = await reader.nextLine();

    assert.equal(firstLine, 'first-line');
    assert.equal(secondLine, 'second-line');
  });

  it('setup and reading from readableStream', async function() {
    const readableStream = fs.createReadStream(path.join(__dirname, '..', 'test-assets', 'lines.txt'));
    const reader = new LinePuller(readableStream);
    const firstLine = await reader.nextLine();
    const secondLine = await reader.nextLine();

    assert.equal(firstLine, 'first-line');
    assert.equal(secondLine, 'second-line');
  });

  it('line skipping', async function() {
    const reader = new LinePuller(path.join(__dirname, '..', 'test-assets', 'lines.txt'));
    await reader.skip(1);
    const firstLine = await reader.nextLine();

    assert.equal(firstLine, 'second-line');
  });

  it('filters lines', async function() {
    const reader = new LinePuller(path.join(__dirname, '..', 'test-assets', 'lines.txt'));
    reader.addFilter(line => line.trim().length > 0);

    const firstLine = await reader.nextLine();
    const secondLine = await reader.nextLine();
    const thirdLine = await reader.nextLine();

    assert.equal(firstLine, 'first-line');
    assert.equal(secondLine, 'second-line');
    assert.equal(thirdLine, 'third-line');
  });

  it('emits EOFs when there is nothing more to read', async function() {
    const reader = new LinePuller(path.join(__dirname, '..', 'test-assets', 'lines.txt'));

    await reader.skip(10);

    const line = await reader.nextLine();
    console.log('line', line)

    assert.equal(line, LinePuller.EOF);
  })

})