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
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './Login';
import Callback from './Callback';
import User from './User';
import './css/App.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    logout = () => {
        console.log('logged out!');
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.accessToken !== prevProps.accessToken) {
            if (this.props.accessToken !== null)
                this.setState({
                    logout: <button onClick={this.logout}>Logout</button>,
                });
            else this.setState({ logout: null });
        }
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    {this.state.logout}
                    <Switch>
                        <Route path="/callback" component={Callback} />
                        <Route path="/user" component={User} />
                        <Route path="/" component={Login} />
                    </Switch>
                </BrowserRouter>
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
