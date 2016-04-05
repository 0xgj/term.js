var Term;

(function () {
    'use strict';

    var socket = io.connect();

    window.addEventListener('load', function () {
        var element = document.getElementById('js-terminal'),
            cell = createCell(element),
            size = getSize(element, cell);

        Term = new Terminal({
            screenKeys: true,
            cursorBlink: true,
            debug: true
        });

        Term.open(element);

        Term.on('data', function (data) {
            socket.emit('terminal-data', data);

        });

        Term.on('resize', function (size) {
            //var size = getSize(element, cell);
            socket.emit('terminal-resize', size);
        });

        socket.on('terminal-data', function (data) {
            Term.write(data);

        });

        socket.on('terminal-resize', function (size) {
            Term.resize(size.cols, size.rows);

        });

        socket.emit('terminal-resize', size);

        window.addEventListener('resize', function () {
            var size = getSize(element, cell);
            socket.emit('terminal-resize', size);

        });

    });

    function getSize(element, cell) {
        var wSubs = element.offsetWidth - element.clientWidth,
            w = element.clientWidth - wSubs,

            hSubs = element.offsetHeight - element.clientHeight,
            h = element.clientHeight - hSubs,

            x = cell.clientWidth,
            y = cell.clientHeight,

            cols = Math.max(Math.floor(w / x), 10),
            rows = Math.max(Math.floor(h / y), 10),

            size = {
                cols: cols,
                rows: rows

            };

        return size;

    }

    function createCell(element) {
        var cell = document.createElement('div');

        cell.innerHTML = '&nbsp';
        cell.style.position = 'absolute';
        cell.style.top = '-1000px';

        element.appendChild(cell);

        return cell;
    }
})();
