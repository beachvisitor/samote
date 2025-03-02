const arole = require('arole');
const events = require('./events');

class Touch {
    static time = 0;
    static state = '';

    static down() {}
    static update() {}
    static up() {}

    static init() {
        const actions = ['down', 'update', 'up'];
        actions.forEach(action => {
            this[action] = (x, y) => {
                events.wait(`touch:${action}`, { x, y })
                    .then(({ x, y, cooldown = 100 }) => {
                        if (action === 'down') {
                            // Prevent a bug where touch events
                            // would remain visualized as a circle
                            // after fast and frequent simulations.
                            const now = Date.now();
                            if (now - this.time < cooldown || this.state !== 'up') return;
                            this.time = now;
                        }
                        arole.Touch[action](x, y);
                        this.state = action;
                    });
            };
        })
    }
}

class Keyboard {
    static down() {}
    static up() {}

    static init() {
        const actions = ['down', 'up'];
        actions.forEach(action => {
            this[action] = (key) => {
                events.wait(`keyboard:${action}`, { key })
                    .then(({ key }) => arole.Keyboard.has(key) && arole.Keyboard[action](key));
            };
        })
    }
}

Touch.init();
Keyboard.init();

module.exports = {
    Touch,
    Keyboard
};