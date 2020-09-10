export const getAccessToken = store => store.spot.accessToken;

export const getRefreshToken = store => store.spot.refreshToken;

export const getUserData = store => store.spot.userData;

export const getError = store => store.spot.error;

export const getLoggedIn = store => store.spot.loggedIn;

export const getUserPlaylists = store => store.spot.userPlaylists;

export const getPlaylistSongs = (store, playlistName) => store.spot.playlistSongs.get(playlistName);