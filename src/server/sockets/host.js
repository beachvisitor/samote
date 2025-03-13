const sockets = require('./index');
const users = require('../../users');
const events = require('../../events');

sockets.host.on('connection', (socket) => {
    const id = socket.handshake.auth.id;
    const host = users.host();
    if (host?.socket) return socket.disconnect();
    users.add(id, { type: 'host', socket });
    socket.on('disconnect', () => users.remove(id));
});