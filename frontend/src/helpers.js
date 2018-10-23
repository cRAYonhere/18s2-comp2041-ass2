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
/***********************************************************
Login
***********************************************************/
/**
 *	Takes an element where login needs to be setup with div options
 *
 */
export function addLogin(parentElement, options){

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
	checkUnamePass(parentElement);
}


/*
 * Extracts username password from loginDiv Element and verifies user credentials
 *https://stackoverflow.com/questions/29311918/how-do-i-capture-data-entered-into-the-field-of-an-html-form
 */
function checkUnamePass(parentElement){
	var submitbtn = document.getElementById('submitBtn');
	//console.log(submitbtn);
	var username = document.getElementsByName('uname');
	var password = document.getElementsByName('pswd');
	submitbtn.addEventListener('click', async function(){
		if (document.getElementById('incorrect-uPass') != null ){
			//https://stackoverflow.com/questions/3387427/remove-element-by-id
			document.getElementById('incorrect-uPass').remove();
		}
		var uname = username[0].value;
		var pswd = password[0].value;

		if (uname == null || uname == '' || pswd == null || pswd == '') {
			loginError(document.getElementById('loginPassword'));
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
				loginError(document.getElementById('loginPassword'));
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
		btn.after(error);
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

export function addRegistration(parentElement, options){
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
		//creates a registration button  and returns it if loginDiv is not found
	}

	regBtn.addEventListener('click', function(){
		var regPageHeader = createElement('h1', null, {id:'registrationPage',style:'color:#1ec503'});
		regPageHeader.innerHTML = 'Register';
		document.getElementById('frontpageUnamePass').remove();
		appendElement(parentElement, regPageHeader);
		var formDiv = createElement('div', null, options);
		populateRegistrationForm(formDiv);
		appendElement(parentElement, formDiv);

	});
}


function populateRegistrationForm(formDiv){

	var slaveName = createElement('label', null, {for:'slaveName'});
	slaveName.innerHTML=boldStatement('Official Name');
	greenText(slaveName);
	var slaveNamePlaceHolderText = createElement('input', null, {id: 'newUsername', type: 'text', placeholder:'Your slave name', name: 'slaveName', require:true});
	appendElement(formDiv, slaveName);
	appendElement(formDiv, slaveNamePlaceHolderText);

	var uname = createElement('label', null, {for:'uname'});
	uname.innerHTML=boldStatement('Username');
	greenText(uname);
	var unamePlaceHolderText = createElement('input', null, {id: 'newUsername', type: 'text', placeholder:'Hence Forth You Shall Be Beckoned As', name: 'uname', require:true});
	appendElement(formDiv, uname);
	appendElement(formDiv, unamePlaceHolderText);
	// XXX implement realtime username check

	/*
	 * Add password here.
	 */
	var submitRegBtn = createElement('button', null, {id:'submitRegBtn', type:'submit'});
	submitRegBtn.innerHTML='Submit';
	appendElement(formDiv, submitRegBtn);
}
