var ModalWindow = require('../'),
    compileFunc = require('jade!./template.pug'),
    VK = require('../../api-vk');

/**
* Компонент модального окна для просмотра фотографий
* @class
*/

class PhotoWindow extends ModalWindow {

  /**
   * Конструктор класса
   * @param {string} container - Селектор элемента контейнера
   * @param {number} photoId - id выбранной фотографии
   * @param {number} albumId - id альбома для выбранной фотографии
   */

  constructor(container, photoId, albumId) {
    super(container);
    this.photoId = photoId;
    this.albumId = albumId;
    this._loadPhotoList()
        .then((response) => this._readPhotoList(response));

  }

  /**
  * Метод для загрузки данных о фотографиях в альбоме
  * @returns {Promise} - Данные фотографий
  */
  _loadPhotoList() {
    return VK.callApi('photos.get', {
        album_id: this.albumId
    });
  }

  /**
   * Метод для чтения данных о фотографиях в альбоме
   * @param {Object} response - Данные о фотографиях в альбоме
   */
  _readPhotoList(response) {
    this.photoList = response.items;
  }

  /**
  * Метод переключения между фотографиями
  * @param {String} direction - Напраление слайдера
  */
  slide(direction) {
    let nextPhoto;
    let photoList = this.photoList;
    for (let  index = 0; index <= photoList.length - 1; index++ ) {

      if (direction === 'next') {

        if (this.photoId === this.photoList[index].id) {
          nextPhoto = (index === photoList.length - 1) ? photoList[0] : photoList[index + 1];
          this.photoId = nextPhoto.id;
          break;
        }
      }

      if (direction === 'previous') {

        if (this.photoId === this.photoList[index].id) {
          nextPhoto = (index === 0) ? photoList[photoList.length - 1] : photoList[index - 1];
          this.photoId = nextPhoto.id;
          break;
        }
      }
    }

    this._initialize()
        .then(() => this._readTemplate())
        .then(()=> this.insert(this.template));
  }

  /**
   * Метод для загрузки данных фотографии
   * @returns {Promise} - Данные фотографии
   */

  _loadPhoto() {
    return VK.callApi('photos.get', {
      album_id: this.albumId,
      photo_ids: this.photoId,
      extended: 1
    });
  }

  /**
   * Метод для чтения данных фотографии
   * @param {Object} response - Данные фотографии
   */
  _readPhoto(response) {
    this.photo = {
      url: response.items[0].photo_604,
      title: response.items[0].text,
      likes: response.items[0].likes.count
    };
  }

  /**
   * Метод для загрузки данных пользователя
   * @returns {Promise} - Данные пользователя
   */

  _loadUser() {
    return VK.callApi('users.get', { fields: 'photo_200' });
  }

  /**
   * Метод для чтения данных пользователя
   * @param {Object} response - Данные пользователя
   */

  _readUser(response) {
    this.photo.user = {
      id: response[0].id,
      name: response[0].first_name,
      surname: response[0].last_name,
      photoUrl: response[0].photo_200
    }
  }

  /**
   * Метод для загрузки данных комментариев к фото
   * @returns {Promise} - Данные комментариев
   */

  _loadComments() {
    return VK.callApi('photos.getComments', {
      photo_id: this.photoId,
      extended: 1
    });
  }

  /**
   * Метод для чтения данных комментариев к фото
   * @param {Object} response - Данные комментариев
   */

  _readComments(response) {
    this.photo.comments = [];
    response.items.forEach((item) => {
      let params = {
        text: item.text,
        userName: response.profiles
          .find((user) => user.id === item.from_id)
          .first_name,
        userSurname: response.profiles
          .find((user) => user.id === item.from_id)
          .last_name,
        userPhotoUrl: response.profiles
          .find((user) => user.id === item.from_id)
          .photo_100
      };
      this.photo.comments.push(params);
    });
  }

  /**
  * Метод для инициализации данных о фотографии
  */
  _initialize() {
    return this._loadPhoto()
        .then((response) => this._readPhoto(response))
        .then(() => this._loadUser())
        .then((response) => this._readUser(response))
        .then(() => this._loadComments())
        .then((response) => this._readComments(response))
    }

  /**
  * Метод для открытия модального окна просмотра фотографий
  */
  open() {
      this._initialize().then(() => {
          this._readTemplate();
          super.open(this.template);
      });
  }

  /**
   * Метод для чтения шаблонов модального окна просмотра фотографий
   */

  _readTemplate() {
    let options = {
      url: this.photo.url,
      title: this.photo.title,
      likes: this.photo.likes,
      userName: this.photo.user.name,
      userSurname: this.photo.user.surname,
      userPhotoUrl: this.photo.user.photoUrl,
      comments: this.photo.comments
    };
    this.template  = compileFunc(options);
  }
}

module.exports = PhotoWindow;
