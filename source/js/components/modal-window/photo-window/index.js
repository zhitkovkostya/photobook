var ModalWindow = require('../'),
    compileFunc = require('jade!./template.pug'),
    commentsCompileFunc = require('jade!./template-comments.pug'),
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
      url: response.items[0].photo_1280,
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
  * Метод для открытия модального окна просмотра фотографий
  */

  open() {
    this._loadPhoto()
      .then((response) => this._readPhoto(response))
      .then(() => this._loadUser())
      .then((response) => this._readUser(response))
      .then(() => this._loadComments())
      .then((response) => this._readComments(response))
      .then(() => {
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
      userPhotoUrl: this.photo.user.photoUrl
    };
    let photoTemplate  = compileFunc(options);

    let commentsTemplate = '';
    this.photo.comments.forEach((comment) => {
      let commentsOption = {
        name: comment.userName,
        surname: comment.userSurname,
        photoUrl: comment.userPhotoUrl,
        text: comment.text
      };
      commentsTemplate += commentsCompileFunc(commentsOption);
    });
    /** Создание парсера для шаблона, в который будут помещены комментарии пользователей */
    let parser = new DOMParser();
    let doc = parser.parseFromString(photoTemplate, "text/html");
    let commentsContainer = doc.querySelector('.comments_list');

    commentsContainer.innerHTML += commentsTemplate;
    this.template = doc.querySelector('.modal_overlay').outerHTML;
    this.template += doc.querySelector('.modal').outerHTML;
  }
}

module.exports = PhotoWindow;
