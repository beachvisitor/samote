const router = require('express')();
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const events = require('../../events');
const users = require('../../users');

const process = (user) => {
    if (user.access?.view) return;
    const list = user?.webrtc || [];
    for (let i = 0; i < list.length; i++) {
        axios.post(`http://localhost:9997/v3/webrtcsessions/kick/${list[i]}`)
            .then(() => list.splice(i, 1))
            .catch((e) => e.status === 404 && list.splice(i, 1));
    }
}

// Some strange things happen if you don't set the path to /proxy.
// More precisely, if you go to localhost:3001/proxy/screen,
// then everything will be fine, but if you go to localhost:3001/live/screen,
// there will be a redirection to localhost:3001/screen.
// And if you go to localhost:3001/live/screen/whep for example,
// then this behavior will not happen. I think this is related to Mediamtx.

router.use('/', createProxyMiddleware({
    target: 'http://localhost:8889',
    changeOrigin: true,
    on: {
        proxyRes: (proxyRes, req, res) => {
            const webrtc = proxyRes.headers.id;
            if (webrtc) {
                const prev = users.get(req.id);
                users.assign(req.id, { webrtc: [ ...prev?.webrtc || [], webrtc ] });
                process(users.get(req.id));
                events.on('user:modify', (id, user) => process(user));
            }
        }
    }
}));

module.exports = router;