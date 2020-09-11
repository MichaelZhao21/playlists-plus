import React from 'react';
import { login } from '../components/spotify-api';

class Login extends React.Component {
    render() {
        return (
            <div className="Login">
                <h1>Playlists Plus!</h1>
                <button onClick={login}>Log In to Spotify</button>
            </div>
        );
    }
}

export default Login;
