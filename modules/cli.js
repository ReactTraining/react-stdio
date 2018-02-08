#!/usr/bin/env node

const EventStream = require("event-stream");
const JSONStream = require("JSONStream");
const createRequestHandler = require("./index").createRequestHandler;

// Redirect stdout to stderr, but save a reference so we can
// still write to stdout.
const stdout = process.stdout;
Object.defineProperty(process, "stdout", {
  configurable: true,
  enumerable: true,
  value: process.stderr
});

// Ensure console.log knows about the new stdout.
const Console = require("console").Console;
Object.defineProperty(global, "console", {
  configurable: true,
  enumerable: true,
  value: new Console(process.stdout, process.stderr)
});

// Read JSON blobs from stdin, pipe output to stdout.
process.stdin
  .pipe(JSONStream.parse())
  .pipe(EventStream.map(createRequestHandler(process.cwd())))
  .pipe(stdout);
