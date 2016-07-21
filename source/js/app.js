var Album = require('./components/album/album');
var User = require('./components/user/user.js');

if(document.querySelector('.album-card_list')) {
  new Album('.album-card_list');
}

if (document.querySelector('.user-panel')) {
  new User('.user-panel');
}

