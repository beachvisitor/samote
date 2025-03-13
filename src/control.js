const arole = require('arole');
const events = require('./events');

class Touch {
    time = 0;
    state = '';

    down() {}
    update() {}
    up() {}

    constructor() {
        const actions = ['down', 'update', 'up'];
        actions.forEach(action => {
            this[action] = (x, y) =>
                events.wait(`touch:${action}`, { x, y, cooldown: 100 })
                    .then(({ x, y, cooldown }) => {
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
        });
    }
}

class Keyboard {
    down() {}
    up() {}

    constructor() {
        const actions = ['down', 'up'];
        actions.forEach(action => {
            this[action] = (key) =>
                events.wait(`keyboard:${action}`, { key })
                    .then(({ key }) => arole.Keyboard.has(key) && arole.Keyboard[action](key));
        });
    }
}

module.exports = {
    touch: new Touch(),
    keyboard: new Keyboard()
};