const fs = require('fs');
const path = require('path');
const users = require('./users');
const url = require('./url');
const events = require('./events');

class Addons extends Map {
    path = path.join(process.env.RESOURCES_PATH, 'addons');
    api = {
        events,
        users,
        url,
    };

    constructor(iterable) {
        super(iterable);
    }

    load() {
        fs.readdirSync(this.path).forEach((folder) => {
            const addon = {
                path: path.join(this.path, folder),
                package: {},
                callback: () => {}
            }
            try {
                addon.package = JSON.parse(fs.readFileSync(path.join(addon.path, 'package.json'), 'utf8'));
                if (!['name', 'main'].every(key => key in addon.package) || this.has(addon.package.name)) return;
                addon.callback = require(path.join(addon.path, addon.package.main))?.(this.api);
                this.set(addon.package.name, addon);
                console.log(addon)
            } catch (e) {
                // console.error(e);
            }
        });
    }

    unload() {
        this.forEach((addon) => {
            addon.callback?.();
        });
    }
}

module.exports = new Addons();