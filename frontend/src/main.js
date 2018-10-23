// importing named exports we use brackets
import * as helper from './helpers.js';

// when importing 'default' exports, use below syntax
//import API from './api.js';

//const api  = new API();

document.body.style.backgroundColor = 'black';

var bannerClass = document.querySelector('.banner');
bannerClass.style = 'align-items: center; justify-content: center';
bannerClass.style.backgroundColor = 'black';

var h1Elements = document.getElementsByTagName('h1');
h1Elements[0].style.color='#1ec503';


// we can use this single api request multiple times
//const feed = api.getFeed();

var mainRole = document.querySelector('main');

helper.addLogin(mainRole, {class:'loginContainer', id:'frontpageUnamePass'});
helper.addRegistration(mainRole, null);

/*
feed
.then(posts => {
    posts.reduce((parent, post) => {

        parent.appendChild(createPostTile(post));

        return parent;

    }, document.getElementById('large-feed'))
});



// Potential example to upload an image
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', uploadImage);
*/
