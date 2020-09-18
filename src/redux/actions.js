import {
    SET_ACCESS_TOKEN,
    SET_REFRESH_TOKEN,
    SET_USER_DATA,
    SET_ERROR,
    SET_LOGGED_IN,
    ADD_USER_PLAYLISTS,
    ADD_PLAYLIST_SONGS,
    RESET_STATE,
} from './actionTypes';

export const resetState = () => ({
    type: RESET_STATE,
});

export const setAccessToken = (token) => ({
    type: SET_ACCESS_TOKEN,
    payload: { token },
});

export const setRefreshToken = (token) => ({
    type: SET_REFRESH_TOKEN,
    payload: { token },
});

export const setUserData = (data) => ({
    type: SET_USER_DATA,
    payload: { data },
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: { error },
});

export const setLoggedIn = (loggedIn) => ({
    type: SET_LOGGED_IN,
    payload: { loggedIn },
});

export const addUserPlaylists = (playlists, nextToken) => ({
    type: ADD_USER_PLAYLISTS,
    payload: { playlists, nextToken },
});

export const addPlaylistSongs = (playlistId, playlistSongs, nextToken) => ({
    type: ADD_PLAYLIST_SONGS,
    payload: { playlistId, playlistSongs, nextToken },
});
