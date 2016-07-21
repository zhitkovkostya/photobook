var vk = require('../apiVk');
var template = require('jade!./template.pug');

/**
* Компонент "Альбом"
* @class
*/

class Album {

  /**
  * Конструктор класса
  * @param {string} selector - Селектор элемента
  */

  constructor(selector) {
    if(typeof selector !== 'string') {
      throw new Error('Selector must be a string.');
    }
    this.rootEl  = document.querySelector(selector);
    //$('.album-card_list');

    if (!this.rootEl) {
      throw new Error(`Element not found: ${selector}`);
    }

    this._loadAlbums()
      .then((res) => this._readAlbums(res))
      .then((res) => this._renderAlbums());
  }

  /**
  * Метод для загрузки данных альбома
  * @returns {Promise} - Данные альбомов пользователя
  */

  _loadAlbums() {
    return vk.callApi('photos.getAlbums');
  }

  /**
  * Метод для загрузки обложки альбома
  * @param {number} owner_id - id владельца альбома
  * @param {number} thumb_id - id обложки альбома
  * @returns {Promise} - Данные обложки альбома
  */

  _loadCover(owner_id, thumb_id) {
    if(!(typeof owner_id === 'number') || !(typeof thumb_id === 'number')) {
      throw new Error('Owner_id and thunb_id must be a number.');
    }
    
    return vk.callApi('photos.getById', {photos: owner_id + "_" + thumb_id});
  }
  
  /**
  * Метод для чтения данных альбома
  * @param {Object} - Данные обложки альбома
  */

  _readAlbums(response) {
    if(!(response instanceof Object)) {
      throw new Error('Response must be a Object.');
    }

    this.albums = response.items.sort((a, b) => b.created < a.created);
  }

  /**
  * Метод для отображения основных данных альбома на странице
  */
  
  _renderAlbums() {
    this.albums.forEach((item) => {

      this._loadCover(item.owner_id, item.thumb_id)
        .then((res) => {

          let options = {
            link: "#",
            cover: res[0].photo_604,
            description: item.description,
            count: item.size,
            name: item.title
          };

          this.rootEl.innerHTML += template(options);

        });

    });
  }
}

module.exports = Album;