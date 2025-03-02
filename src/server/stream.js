const { spawn } = require("child_process");
const path = require("path");
const { parse } = require("shell-quote");
const settings = require("./settings");
const events = require('./events');
const sockets = require("./sockets");

// webrtc -framerate 30 -c:v libx264 -preset ultrafast -tune zerolatency -bf 0 -muxdelay 0.001 -crf 20 -maxrate 3000k -bufsize 6000k -rtbufsize 100M -g 50
// jsmpeg ./ffmpeg.exe -f gdigrab -i desktop -framerate 30 -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p -profile:v baseline -level 3.1 -bf 0 -muxdelay 0.001 -crf 20 -maxrate 3000k -bufsize 6000k -rtbufsize 100M -g 50 -f rtsp rtsp://localhost:8554/screen
// audio -f dshow -i audio="Microphone Array (Realtek(R) Audio)"
// webrtc -nostats -framerate 30 -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p -profile:v baseline -level 3.1 -bf 0 -muxdelay 0.001 -crf 20 -maxrate 3000k -bufsize 6000k -rtbufsize 100M -g 50
// jsmpeg -nostats -framerate 30 -c:v libx264 -preset ultrafast -tune zerolatency -bf 0 -muxdelay 0 -crf 23 -g 30

class Stream {
    state;
    prefix = '[STREAM]';
    process;
    path = path.join(process.env.RESOURCES_PATH, 'libs', 'ffmpeg');

    constructor() {
        events.on('user:add', (id, user) => user?.socket?.emit('stream:state', this.state));
    }

    start() {
        return new Promise((resolve, reject) => {
            settings.get().then(data => {
                console.log(this.prefix, 'Started');

                this.process = spawn
                (
                    path.join(this.path, 'ffmpeg.exe'),
                    [
                        '-f', 'gdigrab', '-i', 'desktop',
                        ...parse(data.arguments),
                        '-f', 'rtsp', 'rtsp://localhost:8554/screen'
                    ],
                    { cwd: this.path }
                );

                this.process.stdout.on('data', (data) => {
                    console.log(this.prefix, data.toString());
                });

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
        if (this.process) this.process.kill();
        this.process = null;
        this.update(false);
    }

    reload() {
        this.stop();
        return this.start();
    }

    update(state) {
        this.state = state;
        sockets.forEach(socket => socket.emit('stream:state', this.state));
    }
}

module.exports = new Stream();