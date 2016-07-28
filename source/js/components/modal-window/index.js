class ModalWindow {

  /**
   * Конструктор класса
   * @param {string} container - Селектор элемента контейнера
   */
  
  constructor(container) {
    this.rootEl = document.querySelector(".modal-window");
    this.containerEl = document.querySelector(container);
  }
  
  /**
  * Метод для добавления шаблона на страницу
  * @param {Object} template - Шаблон с подгруженными данными
  */

  insert(template) {
    if(!template) {
      return;
    }
    this.containerEl.innerHTML += template;
  }
  
  /**
  * Метод для отображения(открытия) модального окна
  * @param {Object} template - Шаблон с подгруженными данными
  */

  open(template) {
    this.insert(template);
    this.rootEl.hidden = false;
  }
  
  /**
  * Метод для закрытия модального окна
  */

  close() {
    this.containerEl.innerHTML = '';
    this.rootEl.hidden = true;
  }
}

module.exports = ModalWindow;
