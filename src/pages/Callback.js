import React from 'react';

import { getUserData, getLoggedIn } from '../redux/selectors';
import { setError, setLoggedIn } from '../redux/actions';
import { connect } from 'react-redux';
import { fetchTokens, isCallbackValid } from '../components/spotify-middleware';
import { Redirect } from 'react-router';

class Callback extends React.Component {
    constructor(props) {
        super(props);
        let red = <h2>Loading...</h2>;
        if (!isCallbackValid()) {
            if (this.props.loggedIn) {
                red = <Redirect to="/user" />;
            } else {
                this.props.setError(true);
                red = <Redirect push to="/" />;
            }
        }
        this.state = {
            redirect: red,
        };
    }

    componentDidMount() {
        // Fetch tokens after component loads
        fetchTokens(new URL(window.location).searchParams.toString());
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Redirect to user info page after logged in
        if (this.props.userData !== prevProps.userData && this.props.userData !== null) {
            this.props.setLoggedIn(true);
            this.setState({ redirect: <Redirect push to="/user" /> });
        }
    }

    render() {
        return <div className="Callback">{this.state.redirect}</div>;
    }
}

export default connect((state) => ({ userData: getUserData(state), loggedIn: getLoggedIn(state) }), { setError, setLoggedIn })(
    Callback
);
