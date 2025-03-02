const path = require('path');
const { readAll } = require("./utils");

class Languages {
    path = path.join(process.env.RESOURCES_PATH, `languages`);

    get() {
        return readAll(this.path).catch(console.error);
    }
}

module.exports = new Languages();