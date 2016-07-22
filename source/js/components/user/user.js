
var VK = require('../api-vk');
var compileFn = require("jade!./template.pug");

/**
 * Пользователь вконтакте
 * @class
 */

class User {

    constructor(selector) {
        if (typeof selector !== 'string') {
           throw new Error('Selector must be a string.');
        }

        this.rootEl = document.querySelector(selector);

        if (!this.rootEl) {
            throw new Error(`Element not found: ${selector}`);
        }

        this._loadUser()
            .then(response => this._readUser(response[0]))
            .then(() => this._renderUser());
    }

    /**
     * Метод для получения информации о пользователе
     * @returns {Promise} - Данные ответа сервера
     */
    _loadUser() {
        return VK.callApi('users.get', { fields: 'photo_200, status' });
    }

    /**
     * Метод для записи информации в класс User
     * @param {Object} response - Данные ответа сервера
     */
    _readUser(response) {
        this.name = `${response.first_name} ${response.last_name}`;
        this.url = response.photo_200;
        this.status = response.status;
    }

    /**
     * Метод для добавлении информации о пользователе на страницу
     */
    _renderUser() {
        this.rootEl.innerHTML = compileFn({
            name: this.name,
            photo: this.url,
            status: this.status
        });

    }
}

module.exports = User;
