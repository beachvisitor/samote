const path = require('path');
const { readAll } = require("./utils");

class Layouts {
    path = path.join(process.env.RESOURCES_PATH, `layouts`);

    get() {
        return readAll(this.path).catch(console.error);
    }
}

module.exports = new Layouts();