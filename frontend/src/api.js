// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://127.0.0.1:5000'

const getJSON = (path, options) =>
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));

var TOKEN;
var USER_ID;
/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to the API URL
     * @param {string} url
     */
    constructor(url = API_URL) {
        this.url = url;
    }

    makeAPIRequest(path) {
        return getJSON(`${this.url}/${path}`);
    }

	/**
	 *	using an internal token returns user data
	 */
	getApiUser(){
		return fetch(`${API_URL}/user`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Token '+ TOKEN
			} })
			.then(async function(resp) {
				if(resp.status === 200){
					var userData = await resp.json();
					USER_ID = userData.id;
					return userData;
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404: Post Not Found.';
				}
			});
	}

    /**
     * @returns feed array in json format
     */
    getFeed(p,n) {
		return fetch(`${API_URL}/user/feed?p=${p}&n=${n}`, {
			method: 'GET',
			headers: {
				'accept': 'application/json',
				'Authorization': 'Token '+TOKEN
			}
		}).then(response => {
			return response.json();
		});
    }

    /**
     * @returns auth'd user in json format
     */
    postLogin(authObject) {
		return fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify(authObject),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(async function(resp) {
			var tokenObject = await resp.json();
			if(resp.status === 200){
				//console.log('getMe() '+resp.status);
				//console.log('getMe() '+tokenObject.token);
				TOKEN = tokenObject.token;
			}
			return resp.status;
		});
    }

	/**
	 *	takes a registration object with details and returns status
	 */
	postRegistration(registrationObject) {
		return fetch(`${API_URL}/auth/signup`, {
			method: 'POST',
			body: JSON.stringify(registrationObject),
			headers: {
				'Content-Type': 'application/json'
			} })
			.then(async function(resp) {
				var tokenObject = await resp.json();
				if(resp.status === 200){
					TOKEN = tokenObject.token;
				} else if (resp.status === 400){
					throw resp.status+ ' 400: Malformed Request | 409: Username Taken';
				}
			return resp.status;
			});
	}

	/**
	 * takes an id and add like to the id and returns status
	 */
	putLike(id){
		return fetch(`${API_URL}/post/like?id=${id}`, {
			method: 'PUT',
			headers: {
				'accept': 'application/json',
				'Authorization': 'Token '+TOKEN
			} })
			.then(function(resp) {
				if(resp.status === 200){
					return resp.status;
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404: Post Not Found.';
				}
			});
	}

	/**
	 * takes an id and add removes the like on the id and returns status
	 */
	putUnLike(id){
		return fetch(`${API_URL}/post/unlike?id=${id}`, {
			method: 'PUT',
			headers: {
				'accept': 'application/json',
				'Authorization': 'Token '+TOKEN
			} })
			.then(function(resp) {
				if(resp.status === 200){
					return resp.status;
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404: Post Not Found.';
				}
			});
	}

	/**
	 * takes an id and returns the posts associated with it
	 */
	getPost(id) {
		return fetch(`${API_URL}/post/?id=${id}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Token '+TOKEN
			} })
			.then(function(resp) {
				if(resp.status === 200){
					return resp.json();
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404: Post Not Found.';
				}
			});
	}

	/**
	 * takes an id and commentObject and returns the status of posting the comment
	 */
	putComment(id, commentObject) {
		return fetch(`${API_URL}/post/comment?id=${id}`, {
			method: 'PUT',
			body: JSON.stringify(commentObject),
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Token '+TOKEN,
				'Content-Type': 'application/json'
			} })
			.then(function(resp) {
				if(resp.status === 200){
					return resp.status;
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404: Post Not Found.';
				}
			});
	}

	/**
	 *	takes the username as argument and follows the user if he/she exists
	 */
	 followUser(username){
		 return fetch(`${API_URL}/user/follow?username=${username}`, {
			 method: 'PUT',
			 headers: {
				 'Accept': 'application/json',
				 'Authorization': 'Token '+TOKEN,
			 } })
			 .then(function(resp) {
				 if(resp.status === 200 || resp.status === 404){
					 return resp.status;
				 } else {
					 throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404: User Not Found.';
				 }
			 });
	}

	 /**
 	 *	takes the username as argument and follows the user if he/she exists
 	 */
	 unfollowUser(username){
		 return fetch(`${API_URL}/user/unfollow?username=${username}`, {
			 method: 'PUT',
			 headers: {
				 'Accept': 'application/json',
				 'Authorization': 'Token '+TOKEN,
			 } })
			 .then(function(resp) {
				 if(resp.status === 200){
					 return resp.status;
				 } else {
					 throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token';
				 }
			 });
	}

	/**
	 *
	 */
	 getUserDataByUsername(username){
		 return fetch(`${API_URL}/user/?username=${username}`, {
			 method: 'GET',
			 headers: {
				 'Accept': 'application/json',
				 'Authorization': 'Token '+ TOKEN
			 } })
			 .then(function(resp) {
				 if(resp.status === 200 || resp.status === 404){
					 return resp;
				 } else {
					 throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404: User Not Found.';
				 }
			 });
	}
}
