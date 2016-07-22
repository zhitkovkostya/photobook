var vk = require('../api-vk');
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
      throw new Error(`Selector must be a string: ${selector}.`);
    }
    this.rootEl  = document.querySelector(selector);

    if (!this.rootEl) {
      throw new Error(`Element not found: ${selector}`);
    }

    this._loadAlbums()
      .then((response) => this._readAlbums(response))
      .then(() => this._loadCovers(this.coverOptions))
      .then((response) => this._readCovers(response))
      .then(() => this._renderAlbums());
  }

  /**
  * Метод для загрузки данных альбома
  * @returns {Promise} - Данные альбомов пользователя
  */

  _loadAlbums() {
    return vk.callApi('photos.getAlbums');
  }

  /**
  * Метод для загрузки обложек альбомов
  * @param {string} photos - id обложек альбомов через запятую: <id владельца>_<id фото>
  * @returns {Promise} - Данные обложек альбомов
  */

  _loadCovers(photos) {
    if(typeof photos !== 'string') {
      throw new Error(`Photos must be a string: ${photos}.`);
    }
    return vk.callApi('photos.getById', {photos: photos});
  }
  
  /**
  * Метод для чтения данных альбома
  * @param {Object} response - Данные обложки альбома
  */

  _readAlbums(response) {
    if(!(response instanceof Object)) {
      throw new Error('Response must be a Object.');
    }

    this.albums = response.items.sort((a, b) => b.created < a.created);
    this.coverOptions = '';
    this.albums.forEach((album) => {
      this.coverOptions += album.owner_id + "_" + album.thumb_id + ",";
    });
  }

  /**
   * Метод для чтения данных обложек альбомов
   * @param {Object} response - Данные обложки альбома
   */

  _readCovers(response) {
    if(!(response instanceof Object)) {
      throw new Error('Response must be a Object.');
    }

    this.covers = response;
  }

  /**
  * Метод для отображения основных данных альбома на странице
  */
  
  _renderAlbums() {
    this.albums.forEach((album, index) => {
      let options = {
        link: "#",
        cover: this.covers[index].photo_604,
        description: album.description,
        count: album.size,
        name: album.title
      };

      this.rootEl.innerHTML += template(options);
    });
  }
}

module.exports = Album;