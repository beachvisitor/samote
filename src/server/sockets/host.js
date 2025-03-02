const sockets = require('./index');
const users = require('../users');
const events = require('../events');
const url = require('../url');

sockets.host.on('connection', (socket) => {
    const id = socket.handshake.auth.id;
    const host = users.host();
    if (host?.socket) return socket.disconnect();
    url.set();
    users.add(id, { type: 'host', socket });
    events.on('host:execute', data => socket.emit('execute', data));
    socket.on('disconnect', () => users.remove(id));
});