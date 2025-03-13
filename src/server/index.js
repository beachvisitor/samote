const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const api = require('../api');
const router = require('./routes');
const sockets = require('./sockets');
const url = require('../url');
const { findIP } = require('../utils');

const app = express();
const server = createServer(app);
api.update({ server, express: app });
sockets.init(server);

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

process.env.PORT = '5473';
server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));

let ip;

const updateURL = () => {
    const found = findIP();
    const string = `http://${found}:${process.env.PORT}`;
    if (found !== ip) {
        ip = found;
        url.update(string);
    }
}

updateURL();
setInterval(updateURL, 1500);

module.exports = server;