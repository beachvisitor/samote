const sockets = require("./sockets");
const events = require('./events');

class URL {
    url;

    get() {
        return this.url;
    }

    set(url = this.url) {
        this.url = url;
        sockets.host.emit('url:set', url);
        events.emit('url:set', url);
    }
}

module.exports = new URL();