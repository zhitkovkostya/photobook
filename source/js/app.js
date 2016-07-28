var AlbumsList = require('./components/albums-list');
var User = require('./components/user');
var PhotosList = require('./components/photos-list');
var PhotoWindow = require('./components/modal-window/photo-window');
var router = require('./components/router');

router
  .route({
    url: '^/$',
    templateId: 'view-home',
    controller: viewHomeController
  })
  .route({
    url: '^/album/(.*)',
    templateId: 'view-album',
    controller: viewAlbumController
  });


function viewHomeController() {
  new AlbumsList('.album-card_list');
  let user = new User('.user-panel');
}

function viewAlbumController(albumId) {
  new PhotosList('.photo-card_list', albumId);
  let photoWindow;
  let modalWindow = document.querySelector('.modal-window');
  let photoCards = document.querySelector('.photo-card_list');

  photoCards.addEventListener('click', function(event) {
    let target = event.target;
    let photoId = parseInt(target.dataset.photo);
    let albumId = parseInt(target.dataset.album);
    if(!photoId || !albumId) {
      return;
    }
    photoWindow = new PhotoWindow(".modal-window_photo", photoId, albumId);
    photoWindow.open();
  });

  modalWindow.addEventListener('click', function(event) {
    let target = event.target;
    let closeButton = target.closest('.photo-preview_close');
    if(!closeButton) {
      return;
    }
    photoWindow.close();
  });
}
