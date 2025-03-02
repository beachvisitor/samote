const path = require('path');
const events = require('./events');
const { read, write } = require('./utils');

class Settings {
    path = path.join(process.env.RESOURCES_PATH, 'settings', `settings.json`);

    async get() {
        const promise = read(this.path).catch(console.error);
        await events.wait('settings:get', promise);
        return promise;
    }

    async set(data) {
        const promise = write(this.path, data).catch(console.error);
        await events.wait('settings:set', promise);
        return promise;
    }
}

module.exports = new Settings();