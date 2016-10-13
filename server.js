'use strict';

// var io = require('socket.io')();
var uuid = require('uuid');
var id = uuid.v1();
// var id = 'c569b750-1350-11e6-b828-09b27c2e7440'
var io = require('socket.io-client')('ws://127.0.0.1:8080', {
    query: "id=" + id,


});
console.log('id:', id);
var pty = require('pty.js');

io.on('connect', function() {
    var term = pty.fork(process.env.SHELL || 'sh', [], {
        name: require('fs').existsSync('/usr/share/terminfo/x/xterm-256color') ? 'xterm-256color' : 'xterm',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME
    });

    term.on('data', function(data) {
        console.log('term', data);
        return io.emit('data', data);
    });
    io.on('data', function(data) {
        term.write(data);
    });
    io.on('disconnect', function() {
        console.log('disconnected!!!!!!!!!!!!');
        io.close();
    });
    io.on('reconnecting', function() {
        console.log('reconnecting!!!!!1');
    });
});
