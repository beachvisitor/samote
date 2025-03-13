const { Server } = require('socket.io');
const events = require('../../events');

class Sockets {
    io;
    namespaces = ['host', 'client'];
    host;
    client;

    init(server) {
        this.io = new Server(server, {
            cors: { origin: "*" },
        });
        this.namespaces.forEach(item => {
            this[item] = this.io.of(`/${item}`);
            events.on(`${item}:execute`, data => this[item].emit('execute', data));
            require(`./${item}`);
        });
    }

    forEach(func) {
        this.namespaces.forEach(item => func(this[item]));
    }
}

module.exports = new Sockets();