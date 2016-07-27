var AlbumsList = require('./components/albums-list'),
    User = require('./components/user'),
    PhotosList = require('./components/photos-list');
var album = null;

if(document.querySelector('.album-card_list')) {
  album = $('.album-card_link').attr('id');
  new AlbumsList('.album-card_list');
}

if (document.querySelector('.user-panel')) {
  new User('.user-panel');
}

if (document.querySelector('.photo-card_list')) {
  new PhotosList('.photo-card_list', album);
}

