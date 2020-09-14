import React from 'react';
import { Redirect } from 'react-router';
import { getKey } from '../components/spotify-middleware';

class Refresh extends React.Component {
    constructor(props) {
        super(props);
        this.state = { redirect: <div>Loading...</div> };
    }
    componentDidMount() {
        getKey().then((refreshed) => {
            if (refreshed === null) window.location = window.location.origin;
            else this.setState({ redirect: <Redirect to={`/${this.props.match.params.name}`} /> });
        });
    }
    render() {
        return <div className="Refresh">{this.state.redirect}</div>;
    }
}

export default Refresh;
