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
     * @returns feed array in json format
     */
    getFeed(p,n) {
		return fetch(`${API_URL}/user/feed?p=${p}&n=${n}`, {
			method: 'GET',
			headers: {
				'accept': 'application/json',
				'Authorization': 'Token '+TOKEN
			}
		})
		.then(response => {
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
				if(resp.status === 200 || resp.status === 409){
					var tokenObject = await resp.json();
					TOKEN = tokenObject.token;
					return resp;
				} else if (resp.status === 400){
					throw resp.status +' 400: Malformed Request | 409: Username Taken';
				}
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
	putFollowUser(username){
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
	putUnfollowUser(username){
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
	*	checks for id first, then username
	* 	if none of them are available token owner's data is returned
	*/
	getUserData(id = null, username = null){
		var payload;
		if(id !== null){
			payload = '?id='+id;
		} else if (username !== null) {
			payload = '?username='+username;
		} else {
			payload = '';
		}
		return fetch(`${API_URL}/user/${payload}`, {
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


	/**
	 * @returns auth'd user in json format
	 */
	postPost(postObject) {
		var fetchObject = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Token '+ TOKEN,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postObject)
		};
		return fetch(`${API_URL}/post/`, fetchObject)
		.then(function(resp) {
			if(resp.status === 200 || resp.status == 400){
				return resp;
			} else {
				throw resp.status + ' 400: Malformed Request / Image could not be processed | 403: Invalid Auth Token';
			}

		});
	}

	/**
	 *	for updating user profile
	 *	Takes an object of user profile details
	 * 	and sends it to the backed
	 */
	putProfileUpdate(updateObject){
		return fetch(`${API_URL}/user/`, {
			method: 'PUT',
			body: JSON.stringify(updateObject),
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Token '+TOKEN,
				'Content-Type': 'application/json'
			} })
			.then(function(resp) {
				if(resp.status === 200){
					return resp;
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token';
				}
			});
	}

	/**
	 *	for updating post
	 *	takes an object of post details
	 *  and sends it to the backend
	 */
	putUpdatePost(id, postObject){
		return fetch(`${API_URL}/post/?id=${id}`, {
			method: 'PUT',
			body: JSON.stringify(postObject),
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Token '+TOKEN,
				'Content-Type': 'application/json'
			} })
			.then(function(resp) {
				if(resp.status === 200){
					return resp;
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token';
				}
			});
	}

	/**
	 * Takes an id and deletes the post
	 */
	deleteUpdatePost(id){
		return fetch(`${API_URL}/post/?id=${id}`, {
			method: 'delete',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Token '+TOKEN
			} })
			.then(function(resp) {
				if(resp.status === 200){
					return resp;
				} else {
					throw resp.status + ' 400: Malformed Request | 403: Invalid Auth Token | 404 Post Not Found';
				}
			});
	}



}
