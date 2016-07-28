let View = require('./view');

class Router {

  constructor() {
    this._rootEl = document.querySelector('views');

    if (!this._rootEl) {
      throw new Error('Element \'views\' not found');
    }

    this.cratedCallback();
    this.attachedCallback();
  }

  _onChanged() {
    const path = window.location.pathname;
    const routes = Array.from(this._routes.keys());
    const route = routes.find(r => r.test(path));
    let data = route.exec(path);

    if (data[1]) {
      data = parseInt(data[1]);
    }

    if (!route) {
      return;
    }

    this._newView = this._routes.get(route);

    if (this._currentView) {

      if (this._currentView === this._newView) {
        /* update */
      }

      this._currentView.out();
    }

    this._currentView = this._newView;
    this._newView.in(data);
  }

  _clearRoutes() {
    this._routes.clear();
  }

  _createRoute(route, settings) {
    if (this._routes.has(route)) {
      return console.warn(`Route already exists: ${route}`);
    }

    let viewEl = document.createElement('view');
    let viewContent = document.querySelector(`#${settings.templateId}`);

    if (!viewContent) {
      return;
    }

    let view = new View(viewEl, {
      controller: settings.controller,
      templateId: settings.templateId
    });

    this._rootEl.appendChild(viewEl);
    this._routes.set(route, view);
  }

  route(settings) {
    this._createRoute(new RegExp(settings.url, 'i'), settings);
    return this;
  }

  cratedCallback() {
    this._onChanged = this._onChanged.bind(this);
    this._routes = new Map();
  }

  attachedCallback() {
    window.addEventListener('popstate', this._onChanged);
    setTimeout(() => this._onChanged(), 0);
    // this._onChanged();
  }

  detachedCallback() {
    window.removeEventListener('popstate', this._onChanged);
  }

  go(url) {
    window.history.pushState(null, null, url);
    return this._onChanged();
  }
}

module.exports = Router;
