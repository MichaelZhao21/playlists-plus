import React from 'react';
import { login } from '../components/spotify-api';
import { connect } from 'react-redux';
import { getError, getLoggedIn } from '../redux/selectors';
import { Redirect } from 'react-router';
import { getKey } from '../components/spotify-middleware';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: this.props.error ? <p className="login-error">Error logging in!</p> : null,
        };
    }

    loginButton = () => {
        if (this.props.loggedIn) {
            this.setState({ error: <Redirect to="/user" /> });
        } else {
            getKey().then((refresh) => {
                if (refresh) this.setState({ error: <Redirect to="/user" /> });
                else login();
            });
        }
    };

    render() {
        return (
            <div className="Login">
                <h1>Playlists Plus!</h1>
                <button onClick={this.loginButton}>Log In to Spotify</button>
                {this.state.error}
            </div>
        );
    }
}

export default connect(
    (state) => ({ error: getError(state), loggedIn: getLoggedIn(state) }),
    null
)(Login);
