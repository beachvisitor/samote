const EventEmitter = require('events');

class Events extends EventEmitter {
    constructor() {
        super();
    }

    wait(event, ...args) {
        return new Promise(resolve => {
            this.once(event, resolve);
            setTimeout(() => this.emit(event, ...args));
        });
    }
}

module.exports = new Events();