const path = require('path');
const events = require('./events');
const { read, write } = require('./utils');

class Settings {
    path = path.join(process.env.RESOURCES_PATH, 'settings', 'settings.json');
    default = {
        open: true,
        hide: true,
        start: true,
        password: '',
        language: 'auto',
        theme: 'auto',
        arguments: '-nostats -framerate 30 -c:v libx264 -preset ultrafast -tune zerolatency -bf 0 -muxdelay 0 -crf 23 -g 30'
    }

    async get() {
        return await events.wait('settings:get', read(this.path, this.default));
    }

    async set(data) {
        return await events.wait('settings:set', write(this.path, data));
    }
}

module.exports = new Settings();