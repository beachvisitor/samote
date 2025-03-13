const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const findIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) return net.address;
        }
    }
    return 'localhost';
};

const randomKey = (size = 16) => crypto.randomBytes(size).toString('hex');

const folder = async (folder) => {
    await fs.mkdir(folder, { recursive: true });
    return folder;
};

const read = (file, def = {}) =>
    folder(path.dirname(file))
        .then(() => fs.readFile(file, 'utf8'))
        .then((data) => !data ? write(file, def).then(() => def) : JSON.parse(data))
        .catch((e) => {
            console.error(e);
            return write(file, def).then(() => def);
        });

const readAll = (p, def = {}) =>
    folder(p)
        .then(() => fs.readdir(p))
        .then((files) =>
            Promise.all((files.length > 0 ? files : Object.keys(def).map(key => `${key}.json`)).map((file) => {
                const name = path.basename(file, path.extname(file)); // Removing extension
                return read(path.join(p, file), def[name]).then((data) => ({ [name]: data }));
            }))
        )
        .then((results) =>
            results.reduce((acc, result) => ({ ...acc, ...result }), {})
        );

const write = (file, data) =>
    folder(path.dirname(file))
        .then(() => fs.writeFile(file, JSON.stringify(data, null, 2)))
        .then(() => data)
        .catch((e) => {
            console.error(e);
            return data;
        });

module.exports = {
    findIP,
    randomKey,
    folder,
    read,
    readAll,
    write
};