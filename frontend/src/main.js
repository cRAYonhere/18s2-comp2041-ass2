// importing named exports we use brackets
import * as helper from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

//document.body.style.backgroundColor = 'black';

//https://stackoverflow.com/questions/1702559/ascii-art-in-html
var bannerClass = document.querySelector('.banner');
bannerClass.style = 'align-items: center; justify-content: center';
//bannerClass.style.backgroundColor = 'black';

// we can use this single api request multiple times
//const feed = api.getFeed();

var mainRole = document.querySelector('main');

helper.addLogin(api, mainRole, {class:'loginContainer', id:'frontpageUnamePass'});
helper.addRegistration(api, mainRole, {class:'formContainer', id:'frontpageRegistration', style:'background-color:black;'});
