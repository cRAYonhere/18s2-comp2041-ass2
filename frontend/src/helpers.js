
var USER_DATA;

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
	// XXX CSS Failed
    const section = createElement('section', null, { id:post.id+'-post', class: 'post'});
    section.appendChild(createElement('h2', post.meta.author, { id:post.id+'-post-title', class: 'post-title'}));
	var date = new Date(post.meta.published*1000);
	var dateStr = date.toString();
	section.appendChild(createElement('p', dateStr.substring(0,24), { id:post.id+'-post-published', class: 'post-published'}));
	//https://stackoverflow.com/questions/1347675/html-img-scaling
    section.appendChild(createElement('img', null,
        { id:post.id+'-post-image', src: 'data:image/png;base64,'+post.src, alt: post.meta.description_text, class: 'post-image'}));
	section.appendChild(createElement('p', post.meta.description_text, { id:post.id+'-post-description_text', class: 'post-description_text'}));
	section.appendChild(createElement('span', '(y) '+post.meta.likes.length, { id:post.id+'-post-like', class: 'post-likes'}));
	section.appendChild(createElement('span', '(c) '+post.comments.length, { id:post.id+'-post-comment-count', class: 'post-comments-count'}));
	if (post.comments.length > 0){
		section.appendChild(createElement('span', '+', { id: post.id+'-post-show-comment', class: 'post-show-comments'}));
	} else {
		section.appendChild(createElement('span', '+', { id: post.id+'-post-show-comment', class: 'post-show-comments', style:'display:none;'}));
	}
	section.appendChild(createElement('span', '-', { id: post.id+'-post-hide-comment', class: 'post-hide-comments', style:'display:none;'}));
	return section;
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
function showErrorAfter(ele, msg, id) {
	if(document.getElementById(id) != null ){
		document.getElementById(id).remove();
	}
	var error = createElement('p', null, {id:id, style:'color:red'});
	error.innerHTML = msg;
	ele.after(error);
}

/**
 *	Takes a list and returns the first null or empty string encountered
 *	Otherwise returns true;
 */
function isAnyStringEmpty(list){
	for(let i = 0; i < list.length; i++){
		if(list[i] === '' || list[i] ==  null) {
			return i;
		}
	}
	return false;
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
	var uname = createElement('label', null, { for:'loginUsername'});
	uname.innerHTML=boldStatement('Username');
	greenText(uname);
	var unamePlaceHolderText = createElement('input', null, {class: 'login-field', id: 'loginUsername', type: 'text', placeholder:'Enter Username', name: 'uname', require:true});
	appendElement(loginDiv, uname);
	appendElement(loginDiv, unamePlaceHolderText);

	//Create input field for password and add it to loginDiv
	var upass = createElement('label', null, {for:'loginPassword'});
	upass.innerHTML=boldStatement('Password');
	greenText(upass);
	var upassPlaceHolderText = createElement('input', null, {class: 'login-field', id: 'loginPassword', type: 'password', placeholder:'Enter Password', name: 'pswd', require:true});
	appendElement(loginDiv, upass);
	appendElement(loginDiv, upassPlaceHolderText);

	//https://www.w3schools.com/jsref/prop_style_visibility.asp
	//Registration button is created but in a hiddent mode, to unhide call addRegistration
	var regBtn = createElement('button', null, {id:'registrationBtn', type:'submit', style:'display:none;'});
	regBtn.innerHTML='Register';
	appendElement(loginDiv, regBtn);

	//Login button
	var loginBtn = createElement('button', null, {id:'submitLoginBtn', type:'submit'});
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
	var submitbtn = document.getElementById('submitLoginBtn');
	var username = document.getElementsByName('uname');
	var password = document.getElementsByName('pswd');
	submitbtn.addEventListener('click', async function(){
		var uname = username[0].value;
		var pswd = password[0].value;

		if (uname == null || uname === '' || pswd == null || pswd === '') {
			showErrorAfter(document.getElementById('loginPassword'), 'Username or Password Field Empty.', 'emptyLoginField');
		} else {
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
	return api.postLogin({
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
			throw resp +' Unknown response code';
		}
	});

}

/**
 *	Removes the loginDiv and adds user page
 */
function loggedIn(api, main){
	//removes the loginDiv
	document.getElementById('frontpageUnamePass').remove();
	navigation(api, main);
	feed(api, main);
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
	var submitBtn = parentElement.querySelector('#submitLoginBtn');
	//Checks for a loginDiv
	if( regBtn != null ){
		//https://www.w3schools.com/jsref/prop_style_display.asp
		//Unhides registration button if loginDiv is found
		regBtn.style.display = 'inline';
		submitBtn.style.display = 'inline';
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
	var slaveName = createElement('label', null, {for:'officialName'});
	slaveName.innerHTML=boldStatement('Official Name');
	greenText(slaveName);
	var slaveNamePlaceHolderText = createElement('input', null, {class: 'registration-field', id: 'officialName', type: 'text', placeholder:'Your slave name', name: 'slaveName', require:true});
	appendElement(formDiv, slaveName);
	appendElement(formDiv, slaveNamePlaceHolderText);

	//Username
	var uname = createElement('label', null, {for:'newUsername'});
	uname.innerHTML=boldStatement('Username');
	greenText(uname);
	var unamePlaceHolderText = createElement('input', null, {class: 'registration-field', id: 'newUsername', type: 'text', placeholder:'Hence Forth You Shall Be Beckoned As', name: 'newUname', require:true});
	appendElement(formDiv, uname);
	appendElement(formDiv, unamePlaceHolderText);

	//email
	var email = createElement('label', null, {for:'userEmail'});
	email.innerHTML=boldStatement('Email');
	greenText(email);
	var emailPlaceHolderText = createElement('input', null, {class: 'registration-field', id: 'userEmail', type: 'email', placeholder:'You Shall Not be Spammed!', name: 'uEmailAddress', require:true});
	appendElement(formDiv, email);
	appendElement(formDiv, emailPlaceHolderText);

	//New Password
	var pswd = createElement('label', null, {for:'newUserPassword'});
	pswd.innerHTML=boldStatement('New Password');
	greenText(pswd);
	var pswdPlaceHolderText = createElement('input', null, {class: 'registration-field', id: 'newUserPassword', type: 'password', placeholder:'Create a Secret', name: 'newPassword', require:true});
	appendElement(formDiv, pswd);
	appendElement(formDiv, pswdPlaceHolderText);

	//Confirm New Password
	var confirmPswd = createElement('label', null, {for:'confirmNewUserPassword'});
	confirmPswd.innerHTML=boldStatement('Confirm New Password');
	greenText(confirmPswd);
	var confirmPswdPlaceHolderText = createElement('input', null, {class: 'registration-field', id: 'confirmNewUserPassword', type: 'password', placeholder:'Make Sure to Remember It', name: 'confirmNewPassword', require:true});
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

		if (isAnyStringEmpty([slaveName, newUname, uEmailAddress, newPassword, confirmNewPassword]) !== false) {
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
				var statusNb = await api.postRegistration(registrationObject);
				if(statusNb === 200){
					feed(api, parentElement);
				} else if (statusNb === 409) {
					showErrorAfter(document.getElementById('confirmNewUserPassword'), 'Username not available.', 'formFieldError');
				} else if (statusNb == 400) {
					showErrorAfter(document.getElementById('confirmNewUserPassword'), 'I feel broken. Please try again.', 'formFieldError');
				} else {
					throw statusNb+': Malformed response from postRegistration()';
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
Navigation
***********************************************************/

/*
 * Takes apiObject and main Div as arguments
 * creates the navigation bar
 * and starts events listeners on each options
 */
function navigation(api, parentElement){
	//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_topnav
	var div = createElement('div', null, {class: 'navigation-bar'});
	var myFeedEle = createElement('a', '->My Feed<-', {id: 'myFeedNav', class: 'navigation-elements'});
	div.appendChild(myFeedEle);
	var newPostEle = createElement('a', 'New Post', {id: 'newPostNav', class: 'navigation-elements'});
	div.appendChild(newPostEle);
	var myProfileEle = createElement('a', 'My Profile', {id: 'myProfileNav', class: 'navigation-elements'});
	div.appendChild(myProfileEle);
	var followEle = createElement('a', 'Follow', {id: 'followNav', class: 'navigation-elements'});
	div.appendChild(followEle);
	appendElement(parentElement, div);
	var main = document.querySelector('main');

	myFeedEle.addEventListener('click', function(event) {
		updateNavigationBar(1);
		feed(api, main);
	});

	newPostEle.addEventListener('click', function(event) {
		updateNavigationBar(2);
		newPost(api, main);
	});

	myProfileEle.addEventListener('click', async function(event) {
		updateNavigationBar(3);
		await showProfile(api, main);
		editDelete(api, main);
	});

	followEle.addEventListener('click', function(event) {
		updateNavigationBar(4);
		follow(api, main);
	});
}

/*
 *	Takes a newElement number(1,2,3,4) and updates the corresponding
 * 	nav element as active and deactivates the others
 */
function updateNavigationBar(navElement){
	var myFeed = 'My Feed';
	var newPost = 'New Post';
	var myProfile = 'My Profile';
	var follow = 'Follow';

	var myFeedNav = document.getElementById('myFeedNav');
	var newPostNav = document.getElementById('newPostNav');
	var myProfileNav = document.getElementById('myProfileNav');
	var followNav = document.getElementById('followNav');

	document.getElementById('userDisplay').remove();
	if(navElement === 1){
		myFeedNav.innerHTML = '->'+myFeed+'<-';
	} else {
		myFeedNav.innerHTML = myFeed;
	}

	if(navElement === 2){
		newPostNav.innerHTML = '->'+newPost+'<-';
	} else {
		newPostNav.innerHTML = newPost;
	}

	if(navElement === 3){
		myProfileNav.innerHTML = '->'+myProfile+'<-';
	} else {
		myProfileNav.innerHTML = myProfile;
	}

	if(navElement === 4){
		followNav.innerHTML = '->'+follow+'<-';
	} else {
		followNav.innerHTML = follow;
	}
}

/***********************************************************
Feed Interface
***********************************************************/

/**
 *
 *	Creates a div and makes fetch call to get feed
 *	calls renderUserFeed with array of post objects
 *	calls iteractive to enable like and comments
 */
async function feed(api, main){
	var response = await api.getUserData();
	USER_DATA = await response.json();
	var userDisplay = createElement('div', null,{id:'userDisplay'});
	appendElement(main, userDisplay);
	// XXX implement pagination, infinite scroll
	var p=0;
	var n=100;
	var userData = await api.getFeed(p,n);
	renderUserFeed(userData.posts, userDisplay);
	iteractive(api);
	otherUsersProfile(api, main);
}

/**
 *	populates mainDiv with the post objects from userData Array
 */
function renderUserFeed(userPosts, mainDiv){

	//https://stackoverflow.com/questions/41034716/sort-json-data-based-on-date-and-time
	userPosts.sort(function(a,b){
		return b.meta.published - a.meta.published;
	});

	for(let i = 0; i < userPosts.length; i++){
		let item = createPostTile(userPosts[i]);
		appendElement(mainDiv, item);
	}
}


/***********************************************************
Interactive
***********************************************************/

/**
 *
 *	takes api as an argument and enables
 *	interactive features like 'like', 'unlike'
 */
function iteractive(api){
	likePost(api);
	commentPost(api);
	showComments(api);
}

/**
 *	increases like count
 */
function likePost(api){
	//https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
	var postLikes = document.getElementsByClassName('post-likes');
	var likeClick = async function() {
		var likeId = this.getAttribute('id');
		var postId = likeId.match(/^(\d+).+/)[1];
		var postData = await api.getPost(postId);
		var promiseResponse = 0;
		if (postData.meta.likes.includes(USER_DATA.id) === true){
			promiseResponse = api.putUnLike(postId);
		} else {
			promiseResponse = api.putLike(postId);
		}
		var statusNb = await promiseResponse;
		if (statusNb === 200) {
			var newPostData = await api.getPost(postId);
			updateLikes(newPostData, likeId);
		}
	};

	for (let i = 0; i < postLikes.length; i++) {
		postLikes[i].addEventListener('click', likeClick, false);
	}
}

/**
 *	updates like count on the dom
 */
async function updateLikes(postData, attribute){
	var likeElement = document.getElementById(attribute);
	likeElement.innerHTML = '(y) '+postData.meta.likes.length;
}

/**
 *	Takes in the api object as a argument
 *	attaches a event lister to all comment input commentBox
 *	when a new comment is entered updates the comment in database
 */
function commentPost(api){
	//https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
	var showComments = document.getElementsByClassName('post-show-comments');
	for(let i = 0; i < showComments.length; i++){
		var eleId = showComments[i].getAttribute('id');
		var postId = eleId.match(/^(\d+).+/)[1];
		var commentInput = createElement('label', null, {for: postId+'-comment-box'});
		var slaveNamePlaceHolderText = createElement('input', null, {id: postId+'-comment-box', class:'comment-box', type: 'text', placeholder:'Comments..', name: postId+'-commentBox'});
		appendElement(commentInput, slaveNamePlaceHolderText);
		showComments[i].after(commentInput)
	}

	var postNewComment = async function(attribute) {
		var postId = attribute.match(/^(\d+).+/)[1];
		let input = document.getElementsByName(postId+'-commentBox')[0].value;
		/*If comment box is empty, returns*/
		if(isAnyStringEmpty([input]) !== false){
			return;
		}
		var commentObject = {
			'author': USER_DATA.username,
			'published': Math.round((new Date()).getTime() / 1000),
			'comment': input
		}
		var promiseResponse = api.putComment(postId, commentObject);
		var statusNb = await promiseResponse;
		if (statusNb === 200) {
			//https://stackoverflow.com/questions/14500270/remove-type-text-from-input-field
			document.getElementById(attribute).value = '';
			updateComments(api,attribute,0);
		}
	};

	var postComments = document.getElementsByClassName('comment-box');
	for (let i = 0; i < postComments.length; i++) {
		postComments[i].addEventListener('keyup', function(event) {
			event.preventDefault();
			if (event.keyCode === 13) {
				postNewComment(event.target.id);
			}
		})
	}
}

/*
 *	takes in api, id of the show comment button clicked and number of posts to add
 *	diff = existing comments + more comments required to show
 * 	creates the new comment elements in dom and displays the comments
 */
async function updateComments(api, showCommentId, diff){
	//retractComments(showCommentId);
	var postId = showCommentId.match(/^(\d+).+/)[1];
	var postData = await api.getPost(postId);
	var postCommentCount = document.getElementById(postId+'-post-comment-count');
	var postshowComment = document.getElementById(postId+'-post-show-comment');
	postshowComment.style.display = 'inline';
	postCommentCount.innerHTML = '(c) '+postData.comments.length;
	var section = document.getElementById(postId+'-post');
	postData.comments.sort(function(a,b){
		return b.published-a.published;
	});

	var postComment = section.getElementsByClassName('post-comment');

	var removeId= Array ();
	var showNbComments = Math.min(postData.comments.length, Math.max(postComment.length + diff,1));

	for( let i = 0; i < postComment.length; i++){
		removeId.push(postComment[i].getAttribute('id'));
	}

	for( let j = 0; j < removeId.length; j++){
		document.getElementById(removeId[j]).remove();
	}

	var showCommentBtn = document.getElementById(postId+'-post-show-comment')
	for( let k = 0; k < showNbComments; k++){
		showCommentBtn.after(createElement('p', postData.comments[k].author+': '+postData.comments[k].comment, { id:postId+'-post-comment-'+k, class: 'post-comment'}));
	}
}

/**
 *	if the show comment button is clicked shows last 3 comments
 */
function showComments(api){
	var showComments = document.getElementsByClassName('post-show-comments');

	for (let i = 0; i < showComments.length; i++) {
		showComments[i].addEventListener('click', function(event) {
			event.preventDefault();
			updateComments(api, event.target.id, 3);
		});
	}

}

/***********************************************************
Follow
***********************************************************/

/**
 *
 *	Takes the api as argument
 *	and listes for click event on follow navigation bar
 *	create div elements to support search, follow and unfollow
 */
function follow(api, mainRole){

	var followDiv = createElement('div', null,{id:'userDisplay'});
	var centerDiv = createElement('div', null,{id:'centerDisplayFollowDiv', class: 'center-div'});
	//Search username
	var followUser = createElement('label', null, {for:'followUsername'});
	followUser.innerHTML=boldStatement('Follow User');
	greenText(followUser);
	var placeHolderText = createElement('input', null, {class: 'followUserInput', id: 'followUsername', type: 'text', placeholder:'Username', name: 'followName', require:true});
	appendElement(centerDiv, followUser);
	appendElement(centerDiv, placeHolderText);

	var searchBtn = createElement('p', '| Search |', {id: 'searchUsernameBtn', class: 'search-Username-Btn'});
	appendElement(centerDiv, searchBtn);
	appendElement(followDiv, centerDiv);
	appendElement(mainRole, followDiv);

	searchBtn.addEventListener('click', async function(event) {
		var followConfirmationBtn = document.getElementsByClassName('followConfirmation-Btn');
		for( let i = 0; i < followConfirmationBtn.length; i++){
			document.getElementById(followConfirmationBtn[i].getAttribute('id')).remove();
		}
		var userName = document.getElementsByName('followName')[0].value;
		if(isAnyStringEmpty([userName]) !== false){
			showErrorAfter(placeHolderText,'Please enter a username.', 'followError');
		}
		else if (userName !== USER_DATA.username){
			var srchResponse = await api.getUserData(null,userName);
			if(srchResponse.status === 200 ){

				var response = await api.getUserData();
				USER_DATA = await response.json();

				var srchData = await srchResponse.json();

				//IF user is already following the username give an option to Unfollow, else give an option to follow
				if(USER_DATA.following.includes(srchData.id) === true){
					var confirmUnfollow = createElement('p', 'Unfollow '+userName, {id: 'unfollowConfirmation', class: 'followConfirmation-Btn'});
					appendElement(centerDiv, confirmUnfollow);
					confirmUnfollow.addEventListener('click', async function(event) {
						var response = await api.putUnfollowUser(userName);
						if (response === 200){
							document.getElementById('unfollowConfirmation').innerHTML = 'Unfollowed '+userName;
						}
					});
				} else {

					//var confirmfollow = document.getElementById('followConfirmation');
					//if(confirmfollow == null){
						var confirmfollow = createElement('p', 'Follow '+userName, {id: 'followConfirmation', class: 'followConfirmation-Btn'});
						appendElement(centerDiv, confirmfollow);
					//}
					confirmfollow.addEventListener('click', async function(event) {
						var response = await api.putFollowUser(userName);
						if (response === 200){
							document.getElementById('followConfirmation').innerHTML = 'Following '+userName;
						}
					});
				}


			} else {
				showErrorAfter(placeHolderText,'User Doesn\'t Exist', 'followError');
			}
		} else{
			showErrorAfter(placeHolderText,'Cannot Follow Yourself.', 'followError');
		}
	});
}


/***********************************************************
New Post
***********************************************************/
/**
 * @arg api
 * @arg mainRole
 * creates and manges upload div
 */
function newPost(api, mainRole){
	var newPostDiv = createElement('div', null,{id:'userDisplay', class: 'uploadNewPost'});
	var centerDiv = createElement('div', null,{id:'centerDivNewPost', class: 'center-div'});


	var postDesc = createElement('label', 'Description', {for:'postDescription'});
	postDesc.style.fontWeight = 'bold';
	var descriptionElement = createElement('input', null, {class: 'description-field', id: 'postDescription', type: 'text', placeholder:'Add your description here', name: 'description', require:true});
	appendElement(centerDiv, postDesc);
	appendElement(centerDiv, descriptionElement);

	var upImage = createElement('input', null, {class: 'upload-file', id: 'uploadPost', type: 'file', name: 'uploadImageFile', require:true});
	var submitBtn = createElement('p', '| submit |', {id: 'submitNewPostBtn', class: 'submit-Btn'});
	appendElement(centerDiv, upImage);
	appendElement(centerDiv, submitBtn);
	appendElement(newPostDiv, centerDiv);
	appendElement(mainRole, newPostDiv);

	centerDiv.appendChild(createElement('img', null,{ id:'post-image', src: '#', class: 'post-image', style:'display:none;'}));
	centerDiv.appendChild(createElement('p', null,{ id:'post-description', class: 'post-text-box', style:'display:none;'}));
	centerDiv.appendChild(createElement('p', 'POST',{ id:'confirm-post-submission', class: 'confirm-post', style:'display:none;'}));

	submitBtn.addEventListener('click', function() {

		var descElement = document.getElementById('post-description');
		var post_desc = document.getElementsByName('description')[0].value;
		let imageRaw = document.getElementsByName('uploadImageFile')[0].files;

		if (imageRaw && imageRaw[0] && isAnyStringEmpty([post_desc]) === false) {
			var errorNewPost = document.getElementById('errorNewPost');

			if(errorNewPost){
				document.getElementById('errorNewPost').remove();
			}

			//https://stackoverflow.com/questions/22172604/convert-image-url-to-base64/22172860
			//https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
			const reader = new FileReader();

			reader.addEventListener('load', function () {
				var base64Img = reader.result;
				var pngRE = /data:image\/png;base64,(.+)/;
				var base64Encoding = pngRE.exec(base64Img);
				if(base64Encoding === null){
					showErrorAfter(upImage, 'Incorrect Image format.', 'errorNewPost');
				} else {
					descElement.style.display='block';
					descElement.innerHTML = post_desc;
					let img = document.querySelector('img');  // $('img')[0]
					img.style.display='block';
					img.src = URL.createObjectURL(imageRaw[0]);
					confirmNupload(api, {
							'description_text' : post_desc,
							'src': base64Encoding[1]
					});
				}

			}, false);

			reader.readAsDataURL(imageRaw[0]);
		} else {
			showErrorAfter(upImage, 'Please add Description and Image.', 'errorNewPost');
		}
	});
}

/**
 *
 *	Confirms if the user wants to continue with upload
 */
function confirmNupload(api, postObject){
	var displayPostBtn = document.getElementById('confirm-post-submission');
	displayPostBtn.style.display = '';
	displayPostBtn.addEventListener('click', async function() {
		var errorNewPost = document.getElementById('errorNewPost');
		if(errorNewPost){
			document.getElementById('errorNewPost').remove();
		}
		var resp = await api.postPost(postObject);
		if (resp.status === 200){
			alert('Post Uploaded');
			document.getElementById('userDisplay').remove();
			newPost(api, document.querySelector('main'));
		} else {
			showErrorAfter(displayPostBtn, 'Image Could Not Be processed. Try Again.', 'errorNewPost');
		}
	});
}

/***********************************************************
Show Profile
***********************************************************/

/**
 *	Takes 4 arguments an api object, mainRole and id, username
 *	and generates profile detail along with all posts
 */
function showProfile(api, mainRole, id = null, username = null){
	return new Promise( async (resolve)=>{
		var newPostDiv = createElement('div', null,{id:'userDisplay', class: 'showProfile'});
		var userProfile = createElement('div', null,{id:'userProfileDisplay', class: 'user-Profile-Display'});
		var userPostFeed = createElement('div', null,{id:'userPostFeedDisplay', class: 'user-Post-Feed-Display'});

		appendElement(newPostDiv, userProfile);
		appendElement(newPostDiv, userPostFeed);
		appendElement(mainRole, newPostDiv);

		var response = await api.getUserData(id, username);
		var userData = await response.json();

		/*******************
		Show user's own posts
		********************/

		var likeCommentsCount = {
			'likes': 0,
			'comments': 0
		};
		var promiseArray = new Array ();
		for(let i = 0; i < userData.posts.length; i++){
			promiseArray.push(api.getPost(userData.posts[i]));
		}


		Promise.all(promiseArray).then(function(values){
			renderUserFeed(values,userPostFeed);
			iteractive(api);
			calcLikesComments(likeCommentsCount, values);
			/*****************************
			Show user profile Information
			******************************/
			var followName = '';
			if(id == null && username == null){
				followName = 'u';
			} else {
				followName = userData.username.substring(0,1);
			}
			var infoBar = createElement('div', `${userData.username}\t\t|\t\t(p) ${userData.posts.length}\t\t|\t\t(y) ${likeCommentsCount.likes}\t\t|\t\t(c) ${likeCommentsCount.comments}\t\t|\t\t(->${followName}) ${userData.followed_num}\t\t|\t\t(${followName}->) ${userData.following.length}`,{id:'userProfileInformation', class: 'user-Profile-Information'});

			//Add infoBar to userProfile
			appendElement(userProfile, infoBar);
			resolve(true);
		});
	});
}

/**
 * Takes two arguments an object with likes and comments field and a values array with post objects
 * updates the likes and comments count
 */
function calcLikesComments(likeCommentsCount, values){
	likeCommentsCount.likes = 0;
	likeCommentsCount.comments = 0;

	for(let i = 0; i < values.length; i++){

		likeCommentsCount.likes += values[i].meta.likes.length;
		likeCommentsCount.comments += values[i].comments.length;
	}
}


/***********************************************************
Visit Other's Profile by Feed Username
***********************************************************/

/**
 *	Takes api object and mainRole
 *	listens for click event on all username on Feed
 *	fetches the user data for username and displays on Profile tab
 */
function otherUsersProfile(api, main){
	var userNames = document.getElementsByClassName('post-title');
	function getUserProfile(event){
		var username = event.target.innerHTML;
		var myProfileNav = document.getElementById('myProfileNav');
		myProfileNav.innerHTML = '->'+'Profile'+'<-';
		document.getElementById('userDisplay').remove();
		showProfile(api, main, null, username);
	}
	for(let i = 0; i < userNames.length; i++){
		userNames[i].addEventListener('click',getUserProfile,false);
	}
}

/***********************************************************
Ability to Edit or Delete Profile elements
***********************************************************/

function editDelete(api, main){
	editProfile(api, main);
	editPost(api, main);
}

//Edit profile
function editProfile(api, main){
	var userProfileDisplay = document.getElementById('userProfileDisplay');
	var editProfileBtn = createElement('p', 'Edit Profile',{id:'editProfile', class: 'edit-profile-btn'});
	editProfileBtn.style.fontWeight = 'bold';
	appendElement(userProfileDisplay, editProfileBtn);
	//console.log(userProfileDisplay);

	function editProfileDetails(event){
		var newPostNav = document.getElementById('myProfileNav');
		newPostNav.innerHTML = '->'+'Edit Profile'+'<-';
		document.getElementById('userDisplay').remove();
		var updateProfileDiv = createElement('div', null,{id:'userDisplay', class: 'updateProfile'});
		var submitBtn = createElement('p', '| submit |', {id: 'submitchangeOrderBtn', class: 'submit-Btn'});

		populateChangeFields(updateProfileDiv);

		appendElement(updateProfileDiv, submitBtn);
		appendElement(main, updateProfileDiv);



		submitBtn.addEventListener('click', function(){
			var inputValues = extractValueFromChangeFields();
			var changeObject = createChangeObject(inputValues);
			//console.log(changeObject);
			if(changeObject[1] === 1){
				api.putProfileUpdate(changeObject[0]);
			} else if(changeObject[1] === 2){
				// Do nothing
			}
			else {
				showErrorAfter(document.getElementById('confirmChangePassword'),'Provide Input for the field of your choice.','updateProfile');
			}
		});
	}

	editProfileBtn.addEventListener('click',editProfileDetails,false);
}

function createChangeObject(values){
	var changeFlag = 0;
	var holdFlag = 0;
	var changeObject = {};
	if(values.email != '' && values.email != null){
		changeFlag = 1;
		if(newEmailCheck(values.email)){
			changeObject['email'] = values.email;
		} else {
			holdFlag = 1;
			showErrorAfter(document.getElementById('confirmChangePassword'),'Incorrect Email Format.','updateProfile');
		}

	}

	//Update name
	if(values.officialName != '' && values.officialName != null && holdFlag === 0){
		changeFlag = 1;
		changeObject['name'] = values.officialName;
	}

	//Update password
	if(isAnyStringEmpty([values.newPassword, values.confirmPassword]) === false && holdFlag === 0){
		if(values.newPassword === values.confirmPassword){
			changeFlag = 1;
			changeObject['password'] = values.confirmPassword;
		} else {
			holdFlag = 1;
			showErrorAfter(document.getElementById('confirmChangePassword'),'Passwords Do Not Match','updateProfile');
		}
	}
	if(holdFlag === 1){
		changeFlag = 2;
	}
	return [changeObject, changeFlag];
}

function populateChangeFields(updateProfileDiv){
	var changeName = createElement('label', 'New Name', {for:'changeName'});
	changeName.style.fontWeight = 'bold';
	var inputName = createElement('input', null, {class: 'change-field', id: 'changeName', type: 'text', placeholder:'Enter New Name'});
	appendElement(updateProfileDiv, changeName);
	appendElement(updateProfileDiv, inputName);

	var changeEmail = createElement('label', 'New Email Address', {for:'changeEmail'});
	changeEmail.style.fontWeight = 'bold';
	var inputEmail = createElement('input', null, {class: 'change-field', id: 'changeEmail', type: 'email', placeholder:' Enter New Email Address'});
	appendElement(updateProfileDiv, changeEmail);
	appendElement(updateProfileDiv, inputEmail);

	var changePassword = createElement('label', 'Enter New Password', {for:'changePassword'});
	changePassword.style.fontWeight = 'bold';
	var inputPassword = createElement('input', null, {class: 'change-field', id: 'changePassword', type: 'password', placeholder:'Enter New Passowrd'});
	appendElement(updateProfileDiv, changePassword);
	appendElement(updateProfileDiv, inputPassword);

	var confirmPasswordChange = createElement('label', 'Confirm New Password', {for:'confirmPasswordChange'});
	confirmPasswordChange.style.fontWeight = 'bold';
	var inputPasswordConfirmation = createElement('input', null, {class: 'change-field', id: 'confirmChangePassword', type: 'password', placeholder:'Confirm Password'});
	appendElement(updateProfileDiv, confirmPasswordChange);
	appendElement(updateProfileDiv, inputPasswordConfirmation);
}

function extractValueFromChangeFields(){
	return {	'officialName': document.getElementById('changeName').value,
				'email': document.getElementById('changeEmail').value,
				'newPassword': document.getElementById('changePassword').value,
				'confirmPassword': document.getElementById('confirmChangePassword').value
			};
}

//Edit Posts
function editPost(api, main){
	var postPublished = document.getElementsByClassName('post-published');

	for(let i = 0; i < postPublished.length; i++){
		var publishId = postPublished[i].getAttribute('id');
		var postId = publishId.match(/^(\d+).+/)[1];
		var editPostEle = createElement('p', 'Edit Post',{id:postId+'editPost', class: 'edit-post'});
		postPublished[i].after(editPostEle);

	}

	var editPostsElement = document.getElementsByClassName('edit-post');

	function editPostEvent(event){

		var editPostId = event.target.id;
		var postId = editPostId.match(/^(\d+).+/)[1];
		var newPostNav = document.getElementById('newPostNav');
		newPostNav.innerHTML = '->'+'Edit Post'+'<-';
		document.getElementById('userDisplay').remove();
		var newPostDiv = createElement('div', null,{id:'userDisplay', class: 'editPost'});
		appendElement(main, newPostDiv);

		// XXX create new display div for update or delete post
	}

	for(let i = 0; i < editPostsElement.length; i++) {
		editPostsElement[i].addEventListener('click',editPostEvent,false);
	}
}
