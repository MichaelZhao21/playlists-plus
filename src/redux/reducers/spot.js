import {
    SET_ACCESS_TOKEN,
    SET_REFRESH_TOKEN,
    SET_USER_DATA,
    SET_ERROR,
    SET_LOGGED_IN,
    ADD_USER_PLAYLISTS,
    ADD_PLAYLIST_SONGS,
    RESET_STATE,
} from '../actionTypes';

const initialState = {
    accessToken: null,
    refreshToken: null,
    userData: null,
    userPlaylists: null,
    userNextPlaylistUrl: null,
    error: false,
    loggedIn: false,
    playlistSongs: {},
    nextPlaylistSongsUrl: {},
};

export default function spot(state = initialState, action) {
    switch (action.type) {
        case RESET_STATE: {
            return initialState;
        }
        case SET_ACCESS_TOKEN: {
            const { token } = action.payload;
            return {
                ...state,
                accessToken: token,
            };
        }
        case SET_REFRESH_TOKEN: {
            const { token } = action.payload;
            return {
                ...state,
                refreshToken: token,
            };
        }
        case SET_USER_DATA: {
            const { data } = action.payload;
            return {
                ...state,
                userData: data,
            };
        }
        case SET_ERROR: {
            const { error } = action.payload;
            return {
                ...state,
                error: error,
            };
        }
        case SET_LOGGED_IN: {
            const { loggedIn } = action.payload;
            return {
                ...state,
                loggedIn: loggedIn,
            };
        }
        case ADD_USER_PLAYLISTS: {
            var playlists = state.userPlaylists;
            if (playlists === null) playlists = [];
            playlists = playlists.concat(action.payload.playlists);
            return {
                ...state,
                userPlaylists: playlists,
                userNextPlaylistUrl: action.payload.nextToken,
            };
        }
        case ADD_PLAYLIST_SONGS: {
            let playlistSongs = state.playlistSongs;
            let nextTokens = state.nextPlaylistSongsUrl;
            nextTokens[action.payload.playlistId] = action.payload.nextToken;
            let oldSongs = playlistSongs[action.payload.playlistId];
            if (oldSongs === undefined) oldSongs = [];
            playlistSongs[action.payload.playlistId] = oldSongs.concat(action.payload.playlistSongs);
            return {
                ...state,
                playlistSongs: playlistSongs,
                nextPlaylistSongsUrl: nextTokens
            };
        }
        default:
            return state;
    }
}
