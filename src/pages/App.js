import React from 'react';
import {
    setAccessToken,
    setRefreshToken,
    setUserData,
    setError,
    setLoggedIn,
} from '../redux/actions';
import {
    getAccessToken,
    getRefreshToken,
    getUserData,
    getError,
    getLoggedIn,
} from '../redux/selectors';
import { connect } from 'react-redux';
import { login } from '../components/spotify-api';

import './App.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        console.log(window.location.pathname)
    }

    render() {
        return (
            <div className="App">
                <h1>Playlists Plus!</h1>
                <button onClick={login}>Log In to Spotify!</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    accessToken: getAccessToken(state),
    refreshToken: getRefreshToken(state),
    userData: getUserData(state),
    error: getError(state),
    loggedIn: getLoggedIn(state),
});

const mapDispatchToProps = {
    setAccessToken,
    setRefreshToken,
    setUserData,
    setError,
    setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
