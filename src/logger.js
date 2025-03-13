const fs = require('fs');
const events = require('./events');
const path = require('path');
const util = require('util');
const { folder } = require('./utils');

class Logger {
    path = path.join(process.env.RESOURCES_PATH, 'logs', 'log.log');

    constructor() {
        const types = ['log', 'error', 'info', 'warn'];
        fs.truncate(this.path, 0, () => {});
        types.forEach(type => {
            this[type] = console[type];
            console[type] = (...args) => {
                this[type](...args);
                this.write(type, args);
            }
        });
    }

    write(type, sources) {
        const date = new Date();
        const extended = sources.map(source => {
            if (source instanceof Error) return source.stack || source.message;
            if (typeof source === 'string') return source;
            return util.inspect(source, { depth: null, colors: false });
        })
        const parts = [
            `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`,
            `[${type.toUpperCase()}]`,
            ...extended,
            '\n'
        ]
        events.wait('logger:write', { type, sources, extended, parts, date })
            .then(({ parts }) => {
                folder(path.dirname(this.path))
                    .then(() => fs.appendFile(this.path, parts.join(' '), () => {}))
                    .catch(() => {});
            });
    }
}

module.exports = new Logger();