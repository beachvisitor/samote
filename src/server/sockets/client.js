const sockets = require('./index');
const users = require('../users');
const uap = require('ua-parser-js');
const { Touch, Keyboard } = require('../control');
const events = require("../events");

sockets.client.on('connection', (socket) => {
    const id = socket.handshake.auth.id;
    const ua = uap(socket.request.headers['user-agent']);
    const user = users.add(id, {
        type: 'client',
        socket,
        ip: socket.handshake.address,
        browser: ua.browser,
        system: ua.os
    });

    const touch = (func) => (...args) => user?.access?.touch && func(...args);
    const keyboard = (func) => (...args) => user?.access?.keyboard && func(...args);

    socket.on('touch:down', touch(Touch.down));
    socket.on('touch:update', touch(Touch.update));
    socket.on('touch:up', touch(Touch.up));

    socket.on('keyboard:down', keyboard(Keyboard.down));
    socket.on('keyboard:up', keyboard(Keyboard.up));

    events.on('client:execute', data => socket.emit('execute', data));
    socket.on('disconnect', () => users.remove(id));
});