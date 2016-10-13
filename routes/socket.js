'use strict';
var _ = require('underscore');

var io = process.io;
process.rooms = {
    server: [],
    browser: []
};

io.sockets.on('connection', function(sock) {
    console.log(sock.request.headers);

    if (sock.request.headers['user-agent'] === 'node-XMLHttpRequest') {
        sock.join('server');
        sock.room = 'server';
        sock.connId = sock.handshake.query.id;
        process.rooms.server.push({
            "id": sock.connId,
            socket: sock
        });
        // console.log(rooms.browser);
    } else {
        sock.join('browser');
        sock.room = 'browser';
        sock.connId = sock.handshake.query.id;
        process.rooms.browser.push({
            "id": sock.connId,
            socket: sock,
            connect: sock.handshake.query.connectTo
        });

        for (var index in process.rooms.server) {

            if (process.rooms.server[index].id === sock.handshake.query.connectTo) {

                process.rooms.server[index].connect = sock.connId;

            }
        }
        // console.log(rooms.browser);
    }
    console.log('connected:', process.rooms.server.length, process.rooms.browser.length, sock.id);
    var socketInfo = new socketsInfo(sock);

    socketInfo.onData(function brodcast(data, socket) {
        console.log(data);

        var toRoom = (socket.room === 'server') ? 'browser' : 'server';

        var toID = _.findWhere(process.rooms[socket.room], {
            id: socket.connId
        });
        var toSocket = _.findWhere(process.rooms[toRoom], {
            id: toID.connect
        });
        console.log('toroom', toRoom, toID.connect);
        if (toID.connect) {
            toSocket.socket.emit('data', data);
        }

    });
    socketInfo.disconnect(function disconnet() {

        var id = this.connId;
        var toId = null;
        var toRoom = (this.room === 'server') ? 'browser' : 'server';

        process.rooms[this.room] = process.rooms[this.room].filter(function(obj) {
            if (obj.id !== id) {
                return true;
            } else {
                toId = obj.connect;
                return false;
            }
        });

        console.log('connected:', process.rooms.server.length, process.rooms.browser.length);
    });

});

class socketsInfo {
    constructor(socket) {
        this.socket = socket;
    }
    onData(callback) {
        console.log('waiting', this.socket.connId);
        var socket = this.socket;
        this.socket.on('data', function(data) {

            callback(data, socket);
        });
    }
    sendData(data) {
        this.socket.emit(data);
    }
    disconnect(callback) {
        this.socket.on('disconnect', callback);
    }
}
