const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require("fs");
const router = require('./routes');
const Sockets = require('./sockets');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');
const Addons = require("./addons");
const logger = require("./logger");
const url = require('./url');
const media = require('./media');
const { WebSocketServer } = require('ws');
const { findIP, findPort, read, randomKey } = require('./utils');

const app = express();
const server = createServer(app);

Addons.load();
Sockets.init(server);
media.start().catch(console.log);

const proxyMiddleware = createProxyMiddleware({
    target: 'http://localhost:5174',
    changeOrigin: true
});

const staticMiddleware = express.static(path.join(process.env.STATIC_PATH, 'client/build'));

app.use(cors({ origin: '*', methods: '*' }));
app.use(express.json());
app.use(router);
app.use(process.env.DEV ? proxyMiddleware : staticMiddleware);
app.use(errorMiddleware);

findPort(3001).then((port) => {
    process.env.PORT = String(port);
    server.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
    const string = `http://${findIP()}:${port}`;
    url.def = string;
    url.set(string);
}).catch(console.error);

process.on('beforeExit', Addons.unload);
process.on('SIGINT', () => {
    Addons.unload();
    process.exit(0);
});

module.exports = server;