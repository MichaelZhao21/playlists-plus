export const getAccessToken = (store) => store.spot.accessToken;
export const getRefreshToken = (store) => store.spot.refreshToken;
export const getUserData = (store) => store.spot.userData;
export const getError = (store) => store.spot.error;
export const getLoggedIn = (store) => store.spot.loggedIn;
export const getStoredPlaylists = (store) => store.spot.userPlaylists;
export const getNextPlaylistToken = (store) => store.spot.userNextPlaylistUrl;
export const getStoredPlaylistById = (store, id) =>
    store.spot.userPlaylists.find((i) => i.id === id);
export const getPlaylistSongs = (store, playlistId) => store.spot.playlistSongs[playlistId];
export const getNextSongsToken = (store, playlistId) => store.spot.nextPlaylistSongsUrl[playlistId];
