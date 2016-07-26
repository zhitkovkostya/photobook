var Album = require('./components/album/album'),
    User = require('./components/user/user'),
    Photo = require('./components/photo/photo');
var album = null;

if(document.querySelector('.album-card_list')) {
  new Album('.album-card_list');
}

if (document.querySelector('.user-panel')) {
  new User('.user-panel');
}

if (document.querySelector('.photo-card_list')) {
  new Photo('.photo-card_list', album);
}

