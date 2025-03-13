const sockets = require('./server/sockets');
const events = require('./events');

class URL {
    url;

    constructor() {
        events.on('user:add', (id, user) => user?.socket?.emit('url:update', this.url));
    }

    update(url) {
        this.url = url;
        sockets.host.emit('url:update', url);
        events.emit('url:update', url);
    }
}

module.exports = new URL();