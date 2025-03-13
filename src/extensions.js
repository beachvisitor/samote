const fs = require('fs').promises;
const path = require('path');
const api = require('./api');
const { folder } = require('./utils');

class Extensions extends Map {
    path = path.join(process.env.RESOURCES_PATH, 'extensions');

    constructor(iterable) {
        super(iterable);
    }

    load = () =>
        folder(this.path)
            .then(() => fs.readdir(this.path))
            .then((folders) =>
                Promise.all(folders.map(folder => {
                    const extension = { path: path.join(this.path, folder) };
                    return fs.readFile(path.join(extension.path, 'package.json'), 'utf8')
                        .then(data => {
                            extension.package = JSON.parse(data);

                            const checks = [
                                [
                                    !extension.package.name || !extension.package.main,
                                    'The name or main fields are missing'
                                ],
                                [
                                    typeof extension.package.name !== 'string',
                                    'Unsupported package name'
                                ],
                                [
                                    this.has(extension.package.name),
                                    'The name must be unique'
                                ]
                            ];

                            for (const check of checks) {
                                if (check[0]) throw new Error(check[1]);
                            }

                            extension.name = extension.package.name;

                            return Promise.resolve(require(path.join(extension.path, extension.package.main))?.(api))
                                .then(callback => {
                                    this.set(extension.name, { ...extension, callback });
                                    console.log(`Extension "${extension.name}" successfully loaded!`);
                                })
                                .catch(e => console.error(`Could not execute extension "${extension.name}":`, e));
                        })
                        .catch(e => console.error(`Could not load extension from "${extension.path}":`, e));
                }))
            )
            .catch(console.error);

    unload = () =>
        Promise.all([...this.values()].map(extension =>
            Promise.resolve(extension.callback?.())
                .then(() => console.log(`Extension "${extension.name}" successfully unloaded!`))
                .catch(e => console.error(`Could not unload extension "${extension.name}":`, e))
                .finally(() => this.delete(extension.name))
        )).catch(console.error);
}

module.exports = new Extensions();