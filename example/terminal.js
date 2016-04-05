(function () {
    'use strict';

    var express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        io = require('socket.io').listen(server),
        pty = require('pty.js'),
        terminal = require('../index'),
        INFO_LOG_LEVEL = 2;

    console.log('PID: ' + process.pid, '\nPORT: ' + 8080);
    server.listen(8080);

    app.use(express.static(__dirname));
    app.use(terminal.middleware());

    io.set('log level', INFO_LOG_LEVEL);

    io.sockets.on('connection', function (socket) {
        var Terminal = getTerm();

        Terminal.on('data', function (data) {
            socket.emit('terminal-data', data);

        });

        socket.on('terminal-data', function (data) {
            Terminal.write(data);

        });

        socket.on('terminal-resize', function (size) {
            if ( size != null ){
            Terminal.resize(size.cols, size.rows);
            socket.emit('terminal-resize', size);
            }
        });

    });

    function getTerm() {
        var term = pty.spawn('bash', [], {
            name: 'xterm-color',
            cwd: process.env.HOME,
            env: process.env

        });

        return term;
    }
})();
