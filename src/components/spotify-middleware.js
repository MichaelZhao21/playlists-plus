import { fetchJson, getBearerHeader, getTokens, getUserPlaylists, getUserProfilePrivate, refreshKey } from './spotify-api';
import Cookies from 'universal-cookie';
import store from '../redux/store';
import {
    setError,
    setAccessToken,
    setRefreshToken,
    setUserData,
    setLoggedIn,
    resetState,
    addUserPlaylists,
    addPlaylistSongs
} from '../redux/actions';
import { getAccessToken, getNextPlaylistToken, getUserData, getStoredPlaylists, getStoredPlaylistById, getPlaylistSongs, getNextSongsToken } from '../redux/selectors';
import { SAVE_KEY, STATE_KEY } from './cookieConstants';

/**
 * Checks to see if the callback url is valid by
 * checking if the storedState key is not null
 * @returns {boolean} If the callback is valid or not
 */
export function isCallbackValid() {
    // Get the stored state from the login function
    const cookies = new Cookies();
    var storedState = cookies.get(STATE_KEY) || null;
    return storedState;
}

/**
 * Gets the access and refresh tokens,
 * plus requests the user data for the header
 *
 * @param {string} params The querystring from the callback function
 * @returns {Promise<object>} A promise for the tokens
 */
export async function fetchTokens(params) {
    // Gets promise that returns api call
    var promise = getTokens(params);

    // Check if the promise is null
    if (promise === null) {
        store.dispatch(setError(true));
    } else {
        // Wait for promise to return
        const response = await promise;

        // Check if the response is successful
        if (response.status === 200) {
            // Convert the response to JSON data
            return response.json().then(async (data) => {
                // Save the tokens in the store
                store.dispatch(setAccessToken(data.access_token));
                store.dispatch(setRefreshToken(data.refresh_token));

                // Save the referesh token in cookies
                const cookies = new Cookies();
                cookies.set(SAVE_KEY, data.refresh_token);

                // Get the user data for the navbar
                const userData = await getAndSetUserData();
                return userData;
            });
        } else {
            // Return error if the repsonse fails
            store.dispatch(setError(true));
        }
    }
}

/**
 * Async function to get and set user data in the store
 * @returns {object} The user data object
 */
async function getAndSetUserData() {
    const data = await getUserProfilePrivate(getAccessToken(store.getState()));
    store.dispatch(setUserData(data));
    return data;
}

/**
 * Gets new tokens from the stored refresh key in cookies
 * If no key exists, return null
 * @returns {Promise<boolean>} Returns null if no saved key or promise
 */
export async function getKey() {
    // Retrieve cookie
    const cookies = new Cookies();
    const key = cookies.get(SAVE_KEY) || null;

    // Check if null
    if (key === null) return null;

    // Save the refresh token
    store.dispatch(setRefreshToken(key));

    // Get access token and user data, then set "loggedIn" state to true
    return getNewToken(key).then(() => {
        return getAndSetUserData().then(() => {
            store.dispatch(setLoggedIn(true));
            return true;
        });
    });
}

// Uses the refresh token and calls the API to get a new access token
async function getNewToken(refreshToken) {
    const data = await refreshKey(refreshToken);
    store.dispatch(setAccessToken(data.access_token));
}

/**
 * Logs the user out by clearing store and removing the refresh key from cookies
 */
export function logout() {
    store.dispatch(resetState());
    const cookies = new Cookies();
    cookies.remove(SAVE_KEY);
}

/**
 * Gets access token from store
 * @returns {string} the access token
 */
export function loadAccessToken() {
    return getAccessToken(store.getState());
}

/**
 * Gets user ID from the store
 * @returns {string} The ID of the user
 */
export function getUserId() {
    return getUserData(store.getState()).id;
}

/**
 * Gets a the list of playlists from the store
 * or if null retrieves it using the API
 * 
 * @returns {Promise<object>} {items: list, next: string}
 */
export async function retrievePlaylists() {
    var playlists = await getStoredPlaylists(store.getState());
    var token = await getNextPlaylistToken(store.getState());
    if (playlists !== null) {
        return { items: playlists, next: token };
    }

    var data = await getUserPlaylists();
    store.dispatch(addUserPlaylists(data.items, data.next));
    return data;
}

export async function nextPlaylistPage(nextToken) {
    const response = await fetch(nextToken, {
        method: 'GET',
        headers: getBearerHeader()
    });
    const data = await response.json();
    
    store.dispatch(addUserPlaylists(data.items, data.next));
    return data;
}

/**
 * Gets a the list of playlists from the store
 * or if null retrieves it using the API
 * 
 * @returns {Promise<object>} {items: list, next: string}
 */
export async function retrieveSongs(id) {
    var songs = await getPlaylistSongs(store.getState(), id);
    var token = await getNextSongsToken(store.getState(), id);
    if (songs !== undefined) {
        return { items: songs, next: token };
    }

    var url = getStoredPlaylistById(store.getState(), id).tracks.href;
    var data = await fetchJson(url, 'GET');
    store.dispatch(addPlaylistSongs(id, data.items, data.next));
    return data;
}

export async function nextSongPage(id, nextToken) {
    const data = await fetchJson(nextToken, 'GET');
    store.dispatch(addPlaylistSongs(id, data.items, data.next));
    return data;
}