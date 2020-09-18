import React from 'react';
import { resetState } from '../redux/actions';
import { getLoggedIn } from '../redux/selectors';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Login from './Login';
import Callback from './Callback';
import User from './User';
import './App.scss';
import Cookies from 'universal-cookie';
import { SAVE_KEY, STATE_KEY } from '../components/cookieConstants';
import Playlists from './Playlists';
import Songs from './Songs';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { topStyle: { display: 'none' } };

        if (
            window.location.pathname !== '/callback' &&
            window.location.pathname !== '/' &&
            !window.location.pathname.startsWith('/refresh') &&
            !this.props.loggedIn
        ) {
            window.location = window.location.origin;
        }
    }

    logoutButton = () => {
        this.props.resetState();
        var cookies = new Cookies();
        cookies.remove(SAVE_KEY);
        cookies.remove(STATE_KEY);
        window.location = window.location.origin;
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.loggedIn !== prevProps.loggedIn) {
            if (this.props.loggedIn !== null)
                this.setState({
                    topStyle: { display: 'flex', justifyContent: 'center' },
                });
            else this.setState({ logout: null });
        }
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <div className="top" style={this.state.topStyle}>
                        <ul className="nav">
                            <li>
                                {/* eslint-disable-next-line */}
                                <a className="logout-button" onClick={this.logoutButton}>
                                    Logout
                                </a>
                            </li>
                            <li>
                                <Link to="/user">Home</Link>
                            </li>
                            <li>
                                <Link to="/playlists">Playlists</Link>
                            </li>
                        </ul>
                    </div>
                    <Switch>
                        <Route path="/callback" component={Callback} />
                        <Route path="/user" component={User} />
                        <Route path="/playlists" component={Playlists} />
                        <Route path="/songs/:id" component={Songs} />
                        <Route exact path="/" component={Login} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect((state) => ({ loggedIn: getLoggedIn(state) }), { resetState })(App);
