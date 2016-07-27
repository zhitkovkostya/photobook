var vk = require('../api-vk');
var template = require('jade!./template.pug');

/**
 * Компонент "Фото"
 * @class
 */

class PhotosList {

  /**
   * Конструктор класса
   * @param {string} selector - Селектор элемента
   * @param {number} album - id альбома
   */

  constructor(selector, album) {
    if(typeof selector !== 'string') {
      throw new Error('Selector must be a string.');
    }
    this.rootEl  = document.querySelector(selector);
    this.album = album;

    if (!this.rootEl) {
      throw new Error(`Element not found: ${selector}`);
    }

    this._loadAlbum()
      .then((response) => this._readAlbum(response))
      .then(() => this._loadPhotos())
      .then((response) => this._readPhotos(response))
      .then(() => this._renderPhotos());
  }

  /**
   * Метод для загрузки данных фотографий
   * @returns {Promise} - Данные фотографий альбома
   */

  _loadPhotos() {
    return vk.callApi('photos.get', {
      album_id: this.album.id,
      extended: 1
    });
  }

  /**
  * Метод для загрузки данных альбома
  * @returns {Promise} - Данные альбома
  */
  
  _loadAlbum() {
    return vk.callApi('photos.getAlbums', { album_ids: this.album });
  }
  
  /**
  * Метод для чтения данных альбома
  * @param {Obejct} response - Данные альбома 
  */

  _readAlbum(response) {
    if(!(response instanceof Object)) {
      throw new Error('Response must be an Object.');
    }

    // todo: use current album id
    this.album = response.items[0];
    this.coverId = this.album.thumb_id;
  }

  /**
   * Метод для чтения данных фотографий, где первое фото - обложка альбома
   * @param {Object} response - Данные фотографий 
   */

  _readPhotos(response) {
    this.photos = response.items.sort((a, b) => b.date < a.date);

    let index = this.photos.findIndex((element, index) => element.id === this.coverId);
    let coverPhoto = this.photos.splice(index, 1);
    this.photos.unshift(coverPhoto[0]);
  }

  /**
   * Метод для отображения основных фотографий альбома на странице
   */

  _renderPhotos() {
    this.photos.forEach((photo) => {
      let options = {
        photo: photo.photo_604,
        comments: photo.comments.count,
        likes: photo.likes.count,
        name: photo.text
      };

      this.rootEl.innerHTML += template(options);
    });
  }
}

module.exports = PhotosList;