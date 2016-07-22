var config = require('./config.js');

/**
* API ВКонтакте
* @class
*/

class vkApi {
  
  /**
  * Контсруктор класса
  * @param {number} [apiId=config.apiId] - id приложения
  * @param {number} [perms=config.perms] - id прав доступа пользователя
  * @param {string} [version='5.52'] - версия api ВКонтакте
  */
  
  constructor(apiId = config.apiId, perms = config.perms, version = '5.52') {
    this.apiId = apiId;
    this.perms = perms;
    this.version = version;
  }

  /**
  * Метод для инициализации api и авторизации пользователя
  * @returns {Promise} - Состояние авторизации пользователя
  */

  login() {

    if(this.initedId != this.apiId) {
      VK.init({
        apiId: this.apiId
      });

      this.initedId = this.apiId;
    }

    return new Promise((resolve, reject)=> {
      VK.Auth.getLoginStatus((response)=> {
        if (response.status === 'connected') {
          resolve(response);
        } else {
          reject(new Error('Не авторизован'));
        }
      });
    }).catch(()=> {
      return new Promise((resolve, reject)=> {
        VK.Auth.login((response)=> {
          if (response.session) {
            resolve(response);
          } else {
            reject(new Error('Не удалось авторизоваться'));
          }
        }, this.perms);
      });
    });
  }

  /**
  * Метод для работы с данными api
  * @param {string} method - Наименование метода обращения к api
  * @param {Object} params - Входные параметры
  * @returns {Promise} - Данные ответа сервера
  */

  callApi(method, params) {
    return this.login().then(()=> {
      return new Promise((resolve, reject)=> {
        params = params || {};
        params.v = this.version;
        VK.Api.call(method, params, (response)=> {
          if (response.error) {
            reject(new Error(response.error.error_msg));
          } else {
            resolve(response.response);
          }
        });
      });
    });
  }

}

module.exports = new vkApi();