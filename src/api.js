const control = require('./control');
const events = require('./events');
const languages = require('./languages');
const layouts = require('./layouts');
const logger = require('./logger');
const settings = require('./settings');
const sockets = require('./server/sockets');
const stream = require('./stream');
const users = require('./users');
const utils = require('./utils');
const url = require('./url');

class Api {
    constructor() {
        Object.assign(this, {
            control,
            events,
            languages,
            layouts,
            logger,
            settings,
            sockets,
            stream,
            url,
            users,
            utils
        });
    }

    update(api, data = {}) {
        Object.assign(this, api);
        events.emit('api:update', this, data);
    }

    wait(func) {
        return new Promise((resolve) => {
            events.once('api:update', (api) => func(api) && resolve(api));
        });
    }
}

module.exports = new Api();