const { spawn } = require("child_process");
const path = require("path");

class Media {
    state;
    prefix = '[MEDIA]';
    process;
    path = path.join(process.env.RESOURCES_PATH, 'libs', 'mediamtx');

    start() {
        return new Promise((resolve, reject) => {
            console.log(this.prefix, 'Started');

            this.process = spawn
            (
                path.join(this.path, 'mediamtx.exe'),
                { cwd: path.join(this.path) }
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

            this.state = true;
            resolve();
        });
    }

    stop() {
        console.log(this.prefix, 'Stopped');
        if (this.process) this.process.kill();
        this.process = null;
        this.state = false;
    }

    reload() {
        this.stop();
        return this.start();
    }
}

module.exports = new Media();