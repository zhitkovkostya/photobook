var vk = require('../apiVk');
var template = require('./template.hbs');

/**
* Компонент "Альбом"
* @class
*/

class Album {

  /**
  * Конструктор класса
  * Инициализирует контейнер для альбомов и производит загрузку, чтение данных альбомов и отображение элементов
  */

  constructor() {
    this.albumsContainer = $('.album-card_list');

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
  * @returns {Promise|undefined} - Данные обложки альбома
  */

  _loadCover(owner_id, thumb_id) {
    if(!(typeof owner_id === 'number') || !(typeof thumb_id === 'number')) {
      return;
    }
    
    return vk.callApi('photos.getById', {photos: owner_id + "_" + thumb_id});
  }
  
  /**
  * Метод для чтения данных альбома
  * @param {Object} - Данные обложки альбома
  * @returns {undefined} - В случае некооректных входных параметров
  */

  _readAlbums(response) {
    if(!(response instanceof Object)) {
      return;
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

          this.albumsContainer.append(template(options));

        });

    });
  }
}

module.exports = new Album();