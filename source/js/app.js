var AlbumsList = require('./components/albums-list'),
    User = require('./components/user'),
    PhotosList = require('./components/photos-list'),
    PhotoWindow = require('./components/modal-window/photo-window');
var album = null;

if(document.querySelector('.album-card_list')) {
  new AlbumsList('.album-card_list', album);
}

if(document.querySelector('.user-panel')) {
  let user = new User('.user-panel');
}

if(document.querySelector('.photo-card_list')) {

  new PhotosList('.photo-card_list', album);
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
