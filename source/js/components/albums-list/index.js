var vk = require('../api-vk');
var template = require('jade!./template.pug');

/**
* Компонент "Альбом"
* @class
*/

class AlbumsList {

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
      throw new Error(`Element hasn't found: ${selector}`);
    }

    this._loadAlbums()
      .then(response => this._readAlbums(response))
      .then(() => this._loadPreviews())
      .then(response => this._readCovers(response))
      .then(() => this._renderAlbums())
      .catch((e) => {
        console.warn(e);
      });
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

  _loadPreviews() {
    let previewsQuery = '';

    this.albums.forEach(album => {
      previewsQuery += album.owner_id + "_" + album.thumb_id + ",";
    });

    return vk.callApi('photos.getById', { photos: previewsQuery });
  }
  
  /**
  * Метод для чтения данных альбома
  * @param {Object} response - Данные обложки альбома
  */

  _readAlbums(response) {
    this.albums = response.items.sort((a, b) => b.created < a.created);
  }

  /**
   * Метод для чтения данных обложек альбомов
   * @param {Object} response - Данные обложки альбома
   */
  _readCovers(response) {
    this.covers = response;
  }

  /**
  * Метод для отображения основных данных альбома на странице
  */
  
  _renderAlbums() {
    this.albums.forEach((album, index) => {
      let options = {
        id: album.id,
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

module.exports = AlbumsList;
