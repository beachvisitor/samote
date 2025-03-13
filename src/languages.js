const path = require('path');
const events = require('./events');
const { readAll } = require('./utils');

class Languages {
    path = path.join(process.env.RESOURCES_PATH, 'languages');
    default = {
        en: {
            name: 'English',
            host: {
                start: 'Start',
                stop: 'Stop',
                reload: 'Reload',
                users: {
                    ip: 'IP',
                    system: 'System',
                    browser: 'Browser',
                    modify: {
                        label: 'Modify',
                        view: 'Viewing',
                        touch: 'Touches',
                        keyboard: 'Keyboard',
                        auth: 'Authorized'
                    }
                },
                settings: {
                    title: 'Settings',
                    open: {
                        label: 'Open',
                        description: 'Open the program after switching on the computer'
                    },
                    hide: {
                        label: 'Hide',
                        description: 'Hide the program after switching on the computer and opening the program'
                    },
                    start: {
                        label: 'Start',
                        description: 'Start the stream after opening the program'
                    },
                    password: 'Password',
                    language: {
                        label: 'Language',
                        auto: 'Auto'
                    },
                    theme: {
                        label: 'Theme',
                        auto: 'Auto',
                        light: 'Light',
                        dark: 'Dark'
                    },
                    arguments: 'Arguments',
                    reset: 'Reset',
                    save: 'Save'
                },
                tray: {
                    open: 'Open',
                    quit: 'Quit'
                }
            },
            client: {
                auth: {
                    title: 'Authorization',
                    description: 'Enter your password from the settings',
                    password: 'Password'
                }
            },
            messages: {
                start: {
                    success: 'The stream has started!',
                    error: 'Could not start the stream!'
                },
                stop: {
                    success: 'The stream has stopped!',
                    error: 'Could not stop the stream!'
                },
                reload: {
                    success: 'The stream has been reloaded!',
                    error: 'Could not reload the stream!'
                },
                save: {
                    success: 'The settings have been saved!',
                    error: 'Could not save the settings!'
                },
                auth: {
                    success: 'You have been successfully authorized!',
                    wrong: 'Wrong password!',
                    error: 'Could not authorized!'
                },
                modify: {
                    success: 'Changes applied!',
                    error: 'Could not apply changes!'
                },
                limit: 'Too many attempts!'
            }
        },
        ru: {
            name: 'Русский',
            host: {
                start: 'Запустить',
                stop: 'Остановить',
                reload: 'Перезагрузить',
                users: {
                    ip: 'IP',
                    system: 'Система',
                    browser: 'Браузер',
                    modify: {
                        label: 'Управление',
                        view: 'Просмотр',
                        touch: 'Нажатия',
                        keyboard: 'Клавиатура',
                        auth: 'Авторизованный'
                    }
                },
                settings: {
                    title: 'Настройки',
                    open: {
                        label: 'Открытие',
                        description: 'Открывать программу после включения компьютера'
                    },
                    hide: {
                        label: 'Скрытие',
                        description: 'Скрывать программу после включения компьютера и открытия программы'
                    },
                    start: {
                        label: 'Запуск',
                        description: 'Запускать трансляцию после открытия программы'
                    },
                    password: 'Пароль',
                    language: {
                        label: 'Язык',
                        auto: 'Автоматический'
                    },
                    theme: {
                        label: 'Тема',
                        auto: 'Автоматическая',
                        light: 'Светлая',
                        dark: 'Темная'
                    },
                    arguments: 'Аргументы',
                    reset: 'Сбросить',
                    save: 'Сохранить'
                },
                tray: {
                    open: 'Открыть',
                    quit: 'Закрыть'
                }
            },
            client: {
                auth: {
                    title: 'Авторизация',
                    description: 'Введите ваш пароль из настроек',
                    password: 'Пароль'
                }
            },
            messages: {
                start: {
                    success: 'Трансляция запущена!',
                    error: 'Не удалось запустить трансляцию!'
                },
                stop: {
                    success: 'Трансляция остановлена!',
                    error: 'Не удалось остановить трансляцию!'
                },
                reload: {
                    success: 'Трансляция перезагружена!',
                    error: 'Не удалось перезагрузить трансляцию!'
                },
                save: {
                    success: 'Настройки сохранены!',
                    error: 'Не удалось сохранить настройки!'
                },
                auth: {
                    success: 'Вы успешно авторизованы!',
                    wrong: 'Неправильный пароль!',
                    error: 'Не удалось авторизоваться!'
                },
                modify: {
                    success: 'Изменения применены!',
                    error: 'Не удалось применить изменения!'
                },
                limit: 'Слишком много попыток!'
            }
        },
        uk: {
            name: 'Українська',
            host: {
                start: 'Запустити',
                stop: 'Зупинити',
                reload: 'Перезавантажити',
                users: {
                    ip: 'IP',
                    system: 'Система',
                    browser: 'Браузер',
                    modify: {
                        label: 'Керування',
                        view: 'Перегляд',
                        touch: 'Натискання',
                        keyboard: 'Клавиатура',
                        auth: 'Авторизований'
                    }
                },
                settings: {
                    title: 'Налаштування',
                    open: {
                        label: 'Відкриття',
                        description: "Відкривати програму після увімкнення комп'ютера"
                    },
                    hide: {
                        label: 'Приховування',
                        description: "Приховувати програму після увімкнення комп'ютера та відкриття програми"
                    },
                    start: {
                        label: 'Запуск',
                        description: 'Запускати трансляцію після відкриття програми'
                    },
                    password: 'Пароль',
                    language: {
                        label: 'Мова',
                        auto: 'Автоматична'
                    },
                    theme: {
                        label: 'Тема',
                        auto: 'Автоматична',
                        light: 'Світла',
                        dark: 'Темна'
                    },
                    arguments: 'Аргументи',
                    reset: 'Скинути',
                    save: 'Зберегти'
                },
                tray: {
                    open: 'Відкрити',
                    quit: 'Закрити'
                }
            },
            client: {
                auth: {
                    title: 'Авторизація',
                    description: 'Введіть ваш пароль з налаштувань',
                    password: 'Пароль'
                }
            },
            messages: {
                start: {
                    success: 'Трансляцію запущено!',
                    error: 'Не вдалося запустити трансляцію!'
                },
                stop: {
                    success: 'Трансляцію зупинено!',
                    error: 'Не вдалося зупинити трансляцію!'
                },
                reload: {
                    success: 'Трансляцію перезавантажено!',
                    error: 'Не вдалося перезавантажити трансляцію!'
                },
                save: {
                    success: 'Налаштування збережені!',
                    error: 'Не вдалося зберегти налаштування!'
                },
                auth: {
                    wrong: 'Неправильний пароль!',
                    success: 'Ви успішно авторизовані!',
                    error: 'Не вдалося авторизуватися!'
                },
                modify: {
                    success: 'Зміни застосовано!',
                    error: 'Не вдалося застосувати зміни!'
                },
                limit: 'Забагато спроб!'
            }
        }
    };

    async get() {
        return await events.wait('languages:get', readAll(this.path, this.default));
    }
}

module.exports = new Languages();