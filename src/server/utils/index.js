const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const net = require('net');

const findIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

function findPort(start = 3000) {
    return new Promise((resolve, reject) => {
        function check(port) {
            const server = net.createServer();

            server.once('error', (e) => {
                e.code === 'EADDRINUSE' ? check(port + 1) : reject(e);
            });

            server.once('listening', () => {
                server.close(() => resolve(port));
            });

            server.listen(port);
        }

        check(start);
    });
}

const randomKey = (size = 16) => crypto.randomBytes(size).toString('hex');

const folder = async (folder) => {
    await fs.mkdir(folder, { recursive: true })
    return folder;
};

const read = async (file) => {
    return JSON.parse(await fs.readFile(file, 'utf8'));
};

const readAll = async (p) => {
    const files = await fs.readdir(await folder(p));
    const result = {}
    for (const file of files) {
        result[file.replace('.json', '')] = await read(path.join(p, file));
    }
    return result;
};

const write = (file, data) => {
    return fs.writeFile(file, JSON.stringify(data, null, 2)).then(() => data);
};

module.exports = {
    findIP,
    findPort,
    randomKey,
    folder,
    read,
    readAll,
    write
}