// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://127.0.0.1:5000'

const getJSON = (path, options) =>
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));

var TOKEN;
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
		}).then(response => {
    		return response.json();
		});
    }

    /**
     * @returns auth'd user in json format
     */
    getMe(authObject) {
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
	 *
	 */
	getSignUp(registrationObject) {
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
			}
			return resp.status;
		});
	}
}
