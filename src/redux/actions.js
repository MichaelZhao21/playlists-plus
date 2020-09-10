import {
    SET_ACCESS_TOKEN,
    SET_REFRESH_TOKEN,
    SET_USER_DATA,
    SET_ERROR,
    SET_LOGGED_IN,
    SET_USER_PLAYLISTS,
    ADD_USER_PLAYLISTS,
    SET_PLAYLIST_SONGS,
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

export const setUserPlaylists = (playlists) => ({
    type: SET_USER_PLAYLISTS,
    payload: { playlists },
});

export const addUserPlaylists = (playlists) => ({
    type: ADD_USER_PLAYLISTS,
    payload: { playlists },
});

export const setPlaylistSongs = (playlistName, playlistSongs) => ({
    type: SET_PLAYLIST_SONGS,
    payload: { playlistName, playlistSongs },
});

export const addPlaylistSongs = (playlistName, playlistSongs) => ({
    type: ADD_PLAYLIST_SONGS,
    payload: { playlistName, playlistSongs },
});
