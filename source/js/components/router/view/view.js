class View {

  constructor(view, settings) {
    this.rootEl = view;
    this.controller = settings.controller;
    this.templateId = settings.templateId;
    this._view = null;
  }

  in(data) {
    let viewContent = document.querySelector(`#${this.templateId}`);
    this.rootEl.innerHTML = viewContent.innerHTML;
    this.controller(data);


    return Promise.resolve();
  }

  out() {
    this.rootEl.innerHTML = '';
    return Promise.resolve();
  }

  get route() {
    return this.rootEl.getAttribute('route') || null;
  }
}

module.exports = View;
