/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 *
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;

    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));

    section.appendChild(createElement('img', null,
        { src: '/images/'+post.src, alt: post.meta.description_text, class: 'post-image' }));

    return section;
}


// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;

    // if we get here we have a valid image
    const reader = new FileReader();

    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/*
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}

/*

/***********************************************************
Login
***********************************************************/

/**
 *	takes a parent element and a child element
 *	and then returns the parent with child element added to its body
 */
export function appendElement(parent, ch){
	//console.log(parent);
	return parent.appendChild(ch);
}
/*
 * Sleeps
 * https://stackoverflow.com/questions/s951021/what-is-the-javascript-version-of-sleep
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Takes a String
 * returns the string with HTML tag for BOLD
 */
export function boldStatement(getString){
	return '<b>'+getString+'</b>';
}
/**
 *
 */
export function greenText(getEle) {
	getEle.style.color='#1ec503';
}
/**
 *	Takes an element where login needs to be setup with div options
 *
 */
export function loginDiv(parentElement, options){

	var loginDiv = createElement('div', null, options);

	var uname = createElement('label', null, {for:'uname'});
	uname.innerHTML=boldStatement('Username');
	greenText(uname);
	var unamePlaceHolderText = createElement('input', null, {type: 'text', placeholder:'Enter Username', name: 'uname', require:true});
	appendElement(loginDiv, uname);
	appendElement(loginDiv, unamePlaceHolderText);

	var upass = createElement('label', null, {for:'pswd'});
	upass.innerHTML=boldStatement('Password');
	greenText(upass);
	var upassPlaceHolderText = createElement('input', null, {type: 'password', placeholder:'Enter Password', name: 'pswd', require:true});
	appendElement(loginDiv, upass);
	appendElement(loginDiv, upassPlaceHolderText);

	var loginBtn = createElement('button', null, {type:'submit'});
	loginBtn.innerHTML='Login';
	appendElement(loginDiv, loginBtn);
	appendElement(parentElement, loginDiv);
	checkUnamePass(parentElement, loginDiv);
}


/*
 * Extracts username password from loginDiv Element and verifies user credentials
 *https://stackoverflow.com/questions/29311918/how-do-i-capture-data-entered-into-the-field-of-an-html-form
 */
function checkUnamePass(parentElement,ele){
	var btn = ele.getElementsByTagName('button');
	//console.log(ele);
	var username = document.getElementsByName('uname');
	var password = document.getElementsByName('pswd');
	btn[0].addEventListener('click', async function(){
		if (document.getElementById('incorrect-uPass') != null ){
			//https://stackoverflow.com/questions/3387427/remove-element-by-id
			document.getElementById('incorrect-uPass').remove();
		}
		var uname = username[0].value;
		var pswd = password[0].value;

		if (uname == null || uname == '' || pswd == null || pswd == '') {
			loginError(btn[0]);
		} else {
			//console.log(uname);
			//console.log(pswd);
			var creds = {username:username[0].value, password:password[0].value}
			//https://javascript.info/async-await
			let result = await checkCredentials(creds);
			//console.log(result);
			if( result == true ){
				loggedIn(parentElement);
			} else {
				loginError(btn[0]);
			}
		}
	});
}



/*
 *	Takes a object with user input username and password
 *	checks with local users.json file
 *	If match is found true is returned or else false is returned
 */
function checkCredentials(credential){
	//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	return fetch('http://localhost:8080/data/users.json')
	.then(function(response) {
		return response.json();
	})
	.then(function(users) {
		//console.log(JSON.stringify(myJson));
		for(var i = 0; i < users.length; i++){
			//console.log(users[i]['username']+' == ' +credential.username +' | ' +users[i]['name']+' == ' +credential.password)
			if (users[i]['username'] == credential.username && users[i]['name'] == credential.password){
				return true;
			}
		}
		return false;
	});
}

/*
 * Takes a btn element and adds a login error above it
 *
 */
function loginError(btn){
	if(document.getElementById('incorrect-uPass') == null ){
		var error = createElement('p', null, {id:'incorrect-uPass',style:'color:red'});
		error.innerHTML = 'Incorrect Username or Password. Please Try Again.';
		btn.before(error);
	}
}

/*
 *
 *	Removes the loginDiv and adds user page
 */
function loggedIn(parentElement){
	//console.log('Logged IN');
	var work = createElement('p', null, {id:'workInProgress',style:'color:red'});
	work.innerHTML = 'This page is under construction. c0me back later!';
	document.getElementById('frontpageUnamePass').remove();
	appendElement(parentElement, work);
}


/***********************************************************
Registration
***********************************************************/
