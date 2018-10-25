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
    const section = createElement('section', null, { class: 'post'});
    section.appendChild(createElement('h2', post.meta.author, { id:post.id+'-post-title', class: 'post-title'}));
	section.appendChild(createElement('p', post.meta.published.substring(0, 24), { id:post.id+'-post-published', class: 'post-published'}));
	//https://stackoverflow.com/questions/1347675/html-img-scaling
    section.appendChild(createElement('img', null,
        { id:post.id+'-post-image', src: 'data:image/png;base64,'+post.src, alt: post.meta.description_text, class: 'post-image'}));
	section.appendChild(createElement('p', post.meta.description_text, { id:post.id+'-post-description_text', class: 'post-description_text'}));
	section.appendChild(createElement('span', '(y) '+post.meta.likes.length, { id:post.id+'-post-likes', class: 'post-likes'}));
	section.appendChild(createElement('span', '(c) '+'0', { id:post.id+'-post-comments', class: 'post-comments'}));
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

/**
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
General Functions
***********************************************************/

/**
 *	takes a parent element and a child element
 *	and then returns the parent with child element added to its body
 */
export function appendElement(parent, ch){
	//console.log(parent);
	return parent.appendChild(ch);
}

/**
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
 * Takes an element, error message and id
 * then displays the error message with the id below the element.
 */
function showErrorAfter(btn, msg, id) {
	if(document.getElementById(id) != null ){
		document.getElementById(id).remove();
	}
	var error = createElement('p', null, {id:id, style:'color:red'});
	error.innerHTML = msg;
	btn.after(error);
}

/**
 * fetch function returns a Promise
 * on resolution returns boolean on if user exists
 */
function checkUser(uName) {
	return fetch('http://localhost:8080/data/users.json')
	.then(function(resp) {
		return resp.json();
	})
	.then(function(users) {
		//console.log(JSON.stringify(myJson));
		for(var i = 0; i < users.length; i++){
			if (users[i]['username'] == uName){
				return true;
			}
		}
		return false;
	});
}

/**
 *	asyncronous fetch of url
 *	Takes a url and return data is json format
 */
function getData(url){
	return fetch(url)
	.then(function(resp){
		return resp.json();
	});
}

/**
 *	Takes a list and returns the first null or empty string encountered
 *	Otherwise returns true;
 */
function checkEmptyString(list){
	for(var i = 0; i < list.length; i++){
		if(list[i] === '' || list[i] ==  null) {
			return i;
		}
	}
	return true;
}
/***********************************************************
Login
***********************************************************/

/**
 *	Takes an element where login needs to be setup with div options
 *
 */
export function addLogin(api, parentElement, options){

	var loginDiv = createElement('div', null, options);

	//Create input field for username and add it to loginDiv
	var uname = createElement('label', null, {for:'uname'});
	uname.innerHTML=boldStatement('Username');
	greenText(uname);
	var unamePlaceHolderText = createElement('input', null, {id: 'loginUsername', type: 'text', placeholder:'Enter Username', name: 'uname', require:true});
	appendElement(loginDiv, uname);
	appendElement(loginDiv, unamePlaceHolderText);

	//Create input field for password and add it to loginDiv
	var upass = createElement('label', null, {for:'pswd'});
	upass.innerHTML=boldStatement('Password');
	greenText(upass);
	var upassPlaceHolderText = createElement('input', null, {id: 'loginPassword', type: 'password', placeholder:'Enter Password', name: 'pswd', require:true});
	appendElement(loginDiv, upass);
	appendElement(loginDiv, upassPlaceHolderText);

	//https://www.w3schools.com/jsref/prop_style_visibility.asp
	//Registration button is created but in a hiddent mode, to unhide call addRegistration
	var regBtn = createElement('button', null, {id:'registrationBtn', type:'submit', style:'display:none;'});
	regBtn.innerHTML='Register';
	appendElement(loginDiv, regBtn);

	//Login button
	var loginBtn = createElement('button', null, {id:'submitBtn', type:'submit'});
	loginBtn.innerHTML='Login';
	appendElement(loginDiv, loginBtn);

	appendElement(parentElement, loginDiv);
	checkUnamePass(api, parentElement);
}

/**
 * Extracts username password from loginDiv Element and verifies user credentials
 *https://stackoverflow.com/questions/29311918/how-do-i-capture-data-entered-into-the-field-of-an-html-form
 */
function checkUnamePass(api, parentElement){
	var submitbtn = document.getElementById('submitBtn');
	//console.log(submitbtn);
	var username = document.getElementsByName('uname');
	var password = document.getElementsByName('pswd');
	submitbtn.addEventListener('click', async function(){
		var uname = username[0].value;
		var pswd = password[0].value;

		if (uname == null || uname === '' || pswd == null || pswd === '') {
			showErrorAfter(document.getElementById('loginPassword'), 'Username or Password Field Empty.', 'emptyLoginField');
		} else {
			//console.log(uname);
			//console.log(pswd);
			var creds = {username:username[0].value, password:password[0].value}
			//https://javascript.info/async-await
			let result = await checkCredentials(api, creds);
			if (result === true){
				loggedIn(api, parentElement);
			}
		}
	});
}

/**
 *	Takes a object with user input username and password
 *	checks with local users.json file
 *	If match is found true is returned or else false is returned
 */
function checkCredentials(api, credential){
	//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	return api.getMe({
		'username': credential.username,
		'password': credential.password
	})
	.then((resp) =>{
		if (resp === 200) {
			return true;
		} else if (resp === 403) {
			showErrorAfter(document.getElementById('loginPassword'), 'Invalid Username/Password', 'incorrectUnamePass');
			return false;
		} else if (resp === 400) {
			showErrorAfter(document.getElementById('loginPassword'), 'Missing Username/Password', 'incorrectUnamePass');
			return false;
		} else {
			throw resp +" Unknown response code";
		}
	});

}

/**
 *	Removes the loginDiv and adds user page
 */
function loggedIn(api, parentElement){
	//console.log('Logged IN');

	//removes the loginDiv
	document.getElementById('frontpageUnamePass').remove();
	feed(api, parentElement);
}

/***********************************************************
Registration Form
***********************************************************/

/**
 * Takes a element and options
 * If regBtn is found then it's visibility is changed to inline
 * If regBtn is not found it is created and returned
 * An EventListener is created for listening to clicks on regBtn
 * If regBtn is clicked loginDiv is removed and formDiv is added to the element
 * populateRegistrationForm funtion is called and form elements are added to formDiv
 * submitRegistrationForm function is called to listen to form submission
 */
export function addRegistration(api, parentElement, options){
	var regBtn = parentElement.querySelector('#registrationBtn');
	var submitBtn = parentElement.querySelector('#submitBtn');
	//Checks for a loginDiv
	if( regBtn != null ){
		//https://www.w3schools.com/jsref/prop_style_display.asp
		//Unhides registration button if loginDiv is found
		regBtn.style.display = 'inline';
		submitBtn.style.display = 'inline';
		//console.log(regBtn);
	} else {
		// XXX creates a registration button  and returns it if loginDiv is not found
		return;
	}

	regBtn.addEventListener('click', function(){
		var regPageHeader = createElement('h1', null, {id:'registrationPage',style:'color:#1ec503'});
		regPageHeader.innerHTML = 'Register';
		document.getElementById('frontpageUnamePass').remove();
		appendElement(parentElement, regPageHeader);
		var formDiv = createElement('div', null, options);
		populateRegistrationForm(formDiv);
		appendElement(parentElement, formDiv);
		submitRegistrationForm(api, parentElement);
	});
}

/**
 * creates fields to take in new user information
 * and submit form button is created
 */
function populateRegistrationForm(formDiv){

	//Official Name
	var slaveName = createElement('label', null, {for:'slaveName'});
	slaveName.innerHTML=boldStatement('Official Name');
	greenText(slaveName);
	var slaveNamePlaceHolderText = createElement('input', null, {id: 'slaveName', type: 'text', placeholder:'Your slave name', name: 'slaveName', require:true});
	appendElement(formDiv, slaveName);
	appendElement(formDiv, slaveNamePlaceHolderText);

	//Username
	var uname = createElement('label', null, {for:'newUname'});
	uname.innerHTML=boldStatement('Username');
	greenText(uname);
	var unamePlaceHolderText = createElement('input', null, {id: 'newUsername', type: 'text', placeholder:'Hence Forth You Shall Be Beckoned As', name: 'newUname', require:true});
	appendElement(formDiv, uname);
	appendElement(formDiv, unamePlaceHolderText);

	//email
	var email = createElement('label', null, {for:'uEmailAddress'});
	email.innerHTML=boldStatement('Email');
	greenText(email);
	var emailPlaceHolderText = createElement('input', null, {id: 'userEmail', type: 'email', placeholder:'You Shall Not be Spammed!', name: 'uEmailAddress', require:true});
	appendElement(formDiv, email);
	appendElement(formDiv, emailPlaceHolderText);

	//New Password
	var pswd = createElement('label', null, {for:'newPassword'});
	pswd.innerHTML=boldStatement('New Password');
	greenText(pswd);
	var pswdPlaceHolderText = createElement('input', null, {id: 'newUserPassword', type: 'password', placeholder:'Create a Secret', name: 'newPassword', require:true});
	appendElement(formDiv, pswd);
	appendElement(formDiv, pswdPlaceHolderText);

	//Confirm New Password
	var confirmPswd = createElement('label', null, {for:'confirmNewPassword'});
	confirmPswd.innerHTML=boldStatement('Confirm New Password');
	greenText(confirmPswd);
	var confirmPswdPlaceHolderText = createElement('input', null, {id: 'confirmNewUserPassword', type: 'password', placeholder:'Make Sure to Remember It', name: 'confirmNewPassword', require:true});
	appendElement(formDiv, confirmPswd);
	appendElement(formDiv, confirmPswdPlaceHolderText);

	// XXX implement realtime username check

	var submitRegBtn = createElement('button', null, {id:'submitRegBtn', type:'submit'});
	submitRegBtn.innerHTML='Submit';
	appendElement(formDiv, submitRegBtn);
}

/**
 * EventListener listening to clicking of submit form button
 * the form details are collected and a validation is carried out
 */
async function submitRegistrationForm(api, parentElement){
	var submitRegBtn = parentElement.querySelector('#submitRegBtn');
	submitRegBtn.addEventListener('click',async function(){

		var slaveName = document.getElementsByName('slaveName')[0].value;
		var newUname = document.getElementsByName('newUname')[0].value;
		var uEmailAddress = document.getElementsByName('uEmailAddress')[0].value;
		var newPassword = document.getElementsByName('newPassword')[0].value;
		var confirmNewPassword = document.getElementsByName('confirmNewPassword')[0].value;

		if (checkEmptyString([slaveName, newUname, uEmailAddress, newPassword, confirmNewPassword]) != true) {
			showErrorAfter(document.getElementById('confirmNewUserPassword'), 'Incorrect Input.', 'formFieldError');
		} else {
			var retVal1 = newPasswordCheck(newPassword,confirmNewPassword);
			var retVal2 = newEmailCheck(uEmailAddress);
			if(retVal1 && retVal2){
				var registrationObject = {
					'username': newUname,
					'password': confirmNewPassword,
					'email': uEmailAddress,
					'name': slaveName
				}
				var statusNb = await api.getSignUp(registrationObject);
				if(statusNb === 200){
					//console.log(statusNb);
					feed(api, parentElement);
				} else if (statusNb === 409) {
					showErrorAfter(document.getElementById('confirmNewUserPassword'), 'Username not available.', 'formFieldError');
				} else if (statusNb == 400) {
					showErrorAfter(document.getElementById('confirmNewUserPassword'), 'I feel broken. Please try again.', 'formFieldError');
				} else {
					throw statusNb+": Malformed response from getSignUp()";
				}

			} else {
				if(!retVal1){
					showErrorAfter(document.getElementById('confirmNewUserPassword'), 'Passwords Do Not Match.', 'formFieldError');
				} else if (!retVal2) {
					showErrorAfter(document.getElementById('confirmNewUserPassword'), 'Incorrect Email.', 'formFieldError');
				}
			}
		}
	});
}

/*
 * takes two strings and compares if they are ===
 * return true if they are equal and returns false otherwise
 */
function newPasswordCheck(password1, password2){
	//console.log(password1+' '+password2);
	if(password1 !== password2){
		return false;
	}
	return true;
}

/*
 *	takes a string and performs an email regex check and returns true on match
 *	and false on mismatch
 */
function newEmailCheck(email){
	//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
	var re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

/***********************************************************
Feed Interface
***********************************************************/

/**
 *
 *	Creates a div and populates it with posts from fetch
 * 	adds the div to the parent element
 */
async function feed(api, parentElement){
	var mainDiv = createElement('div', null,{id:'mainFeed', style:'border:1px solid'});
	mainDiv.style.backgroundColor = 'black';
	//const url = 'http://localhost:8080/data/feed.json';
	//var jsonData = await getData(url);
	var p=0;
	var n=10;
	var userData = await api.getFeed(p,n);

	//console.log(userData.posts);

	//https://stackoverflow.com/questions/41034716/sort-json-data-based-on-date-and-time
	userData.posts.sort(function(a,b){
		return a-b;
	});

	for(var i = 0; i < userData.posts.length; i++){
		let item = createPostTile(userData.posts[i]);
		appendElement(mainDiv, item);
	}

	appendElement(parentElement, mainDiv);

}
