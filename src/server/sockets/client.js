const sockets = require('./index');
const users = require('../../users');
const uap = require('ua-parser-js');
const { touch, keyboard } = require('../../control');
const events = require("../../events");
const stream = require("../../stream");

sockets.client.on('connection', (socket) => {
    const id = socket.handshake.auth.id;
    const ua = uap(socket.request.headers['user-agent']);
    if (!users.host()?.socket) return socket.disconnect(); // Skipping clients before the host connects
    const user = users.add(id, {
        type: 'client',
        socket,
        ip: socket.handshake.address,
        browser: ua.browser,
        system: ua.os
    });

    const check = (action, func) => (...args) => user?.access?.[action] && func(...args);

    socket.on('touch:down', check('touch', touch.down));
    socket.on('touch:update', check('touch', touch.update));
    socket.on('touch:up', check('touch', touch.up));

    socket.on('keyboard:down', check('keyboard', keyboard.down));
    socket.on('keyboard:up', check('keyboard', keyboard.up));

    const onData = (data) => user?.access?.view && socket.emit('stream:write', data);
    const onUpdate = () => stream.process?.stdout?.on('data', onData);
    onUpdate();
    events.on('stream:update', onUpdate);

    socket.on('disconnect', () => users.remove(id));
});