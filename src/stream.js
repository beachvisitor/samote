const { spawn } = require('child_process');
const path = require('path');
const { parse } = require('shell-quote');
const settings = require('./settings');
const events = require('./events');
const sockets = require('./server/sockets');

class Stream {
    state;
    prefix = '[STREAM]';
    process;
    path = path.join(process.env.STATIC_PATH, 'libs', 'ffmpeg');

    constructor() {
        events.on('user:add', (id, user) => user?.socket?.emit('stream:update', this.state));
    }

    start() {
        return new Promise((resolve, reject) => {
            settings.get().then(data => {
                console.log(this.prefix, 'Started');
                events.emit('stream:start');

                this.process = spawn
                (
                    path.join(this.path, 'ffmpeg.exe'),
                    [
                        '-f', 'gdigrab', '-i', 'desktop',
                        ...parse(data.arguments),
                        '-f', 'mpegts', '-codec:v', 'mpeg1video', '-'
                    ],
                    { cwd: this.path }
                );

                this.process.stderr.on('data', (data) => {
                    console.error(this.prefix, data.toString());
                });

                this.process.on('error', (e) => {
                    console.error(this.prefix, e);
                    reject(e);
                });

                this.process.on('exit', (code, signal) => {
                    console.log(this.prefix, `The process terminated with code ${code} and signal ${signal}`);
                });

                this.update(true);
                resolve();
            });
        });
    }

    stop() {
        console.log(this.prefix, 'Stopped');
        events.emit('stream:stop');
        if (this.process) this.process.kill();
        this.process = null;
        this.update(false);
    }

    reload() {
        events.emit('stream:reload');
        this.stop();
        return this.start();
    }

    update(state) {
        this.state = state;
        sockets.forEach(socket => socket.emit('stream:update', this.state));
        events.emit('stream:update', this.state);
    }
}

module.exports = new Stream();