import Cookies from 'universal-cookie';
import querystring from 'querystring';
import creds from '../files/creds.json';
import { getUserId, loadAccessToken } from './spot-middleware';
import { STATE_KEY } from './cookieConstants';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export function login() {
    // Generate a random string to create the key for the cookie
    var state = generateRandomString(16);

    // Save that string as a cookie
    const cookies = new Cookies();
    cookies.set(STATE_KEY, state, { sameSite: 'strict', secure: true });

    // Set the scopes to authenticate
    var scope = 'user-read-private user-read-email';

    // Redirect to the Spotify authentication endpoint
    window.location.href =
        'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: creds.clientId,
            scope: scope,
            redirect_uri: creds.redirectUri,
            state: state,
        });
}

/**
 * @returns {object} A simple object with the auth token as a base64 string
 */
function getAuthHeader() {
    return {
        Authorization:
            'Basic ' +
            new Buffer(creds.clientId + ':' + creds.clientSecret).toString(
                'base64'
            ),
        'Content-Type': 'application/x-www-form-urlencoded',
    };
}

/**
 * @returns {object} A simple object with the Bearer authorization header
 */
function getBearerHeader() {
    return {
        Authorization: 'Bearer ' + loadAccessToken(),
    };
}

/**
 * Requests the refresh and access tokens after checking state
 * @param {string} params The query parameters returned by the Auth API
 * @returns {Promise<Response>} A promise that gets the tokens
 */
export function getTokens(params) {
    // Gets the code and state from the querystring
    var req = querystring.decode(params);
    var code = req.code || null;
    var state = req.state || null;

    // Gets the stored state from cookies
    const cookies = new Cookies();
    var storedState = cookies.get(STATE_KEY) || null;

    // If the state is invalid, return null
    if (state === null || state !== storedState) return null;

    // Remove the temp statekey cookie
    cookies.remove(STATE_KEY);

    // Set the auth options for the token request
    const authOptions = {
        method: 'POST',
        body: querystring.encode({
            code: code,
            redirect_uri: creds.redirectUri,
            grant_type: 'authorization_code',
        }),
        headers: getAuthHeader(),
    };

    // Return the promise to get the tokens from the accounts endpoint
    return fetch('https://accounts.spotify.com/api/token', authOptions);
}

export function refreshKey(refreshToken) {
    const refreshOptions = {
        method: 'POST',
        body: querystring.encode({
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
        headers: getAuthHeader(),
    };

    return fetch(
        'https://accounts.spotify.com/api/token',
        refreshOptions
    ).then((response) => response.json());
}

export function getUserProfilePrivate() {
    return fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: getBearerHeader(),
    }).then((response) => response.json());
}

export function getUserPlaylists() {
    return fetch(
        'https://api.spotify.com/v1/users/' + getUserId() + '/playlists',
        {
            method: 'GET',
            headers: getBearerHeader(),
        }
    ).then((response) => response.json());
}
