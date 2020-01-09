#!/usr/bin/env node

var yargs = require('yargs');

yargs
    .command(require('./mp'))
    .command(require('./mult'))
    .help()
    .argv;
