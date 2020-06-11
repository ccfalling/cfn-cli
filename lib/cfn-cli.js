#!/usr/bin/env node

var yargs = require('yargs');

yargs
    .command(require('./mp'))
    .command(require('./web'))
    .command(require('./lib'))
    .help()
    .argv;
