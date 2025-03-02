// Users map by socket id
// There are two user types: host, client and authorized

const sockets = require("./sockets");
const events = require('./events');

const host = {
    type: 'host',
    socket: {}
}

const client = {
    type: 'client',
    socket: {}
}
const authorized = {
    type: 'client',
    name: '',
    access: {},
    token: '',
    socket: {}
}

class Users extends Map {
    constructor(iterable) {
        super(iterable);
    }

    add(id, user) {
        this.assign(id, user);
        const clean = { ...user };
        delete clean.socket;
        events.emit('user:add', id, user);
        sockets.host.emit('user:add', id, clean);
        return this.get(id);
    }

    modify(id, modified) {
        if (!this.has(id)) return;
        const user = this.get(id);
        Object.assign(user, modified);
        const clean = { ...user };
        delete clean.socket;
        events.emit('user:modify', id, clean);
        sockets.host.emit('user:modify', id, clean);
        sockets.client.to(user.socket?.id).emit('user:modify', clean);
        return this.get(id);
    }

    remove(id) {
        const user = this.get(id);
        delete user?.socket;
        sockets.host.emit('user:remove', id);
    }

    assign(id, value) {
        if (this.has(id)) return Object.assign(this.get(id), value);
        this.set(id, value);
        return value
    }

    find(predicate) {
        return [...this.values()].filter(predicate);
    }

    host() {
        return this.find(user => user.type === 'host')[0];
    }
}

module.exports = new Users();