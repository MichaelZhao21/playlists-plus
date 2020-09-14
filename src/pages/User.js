import React from 'react';
import { connect } from 'react-redux';
import { getUserData } from '../redux/selectors';
import { Redirect } from 'react-router';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.userData === null) {
            this.setState({ userInfo: <Redirect push to="/" /> });
        } else {
            let tab = [];
            for (const [key, value] of Object.entries(this.props.userData)) {
                if (typeof value === 'object') {
                    let v2 = '';
                    if (key === 'external_urls') v2 = value.spotify;
                    else if (key === 'followers') v2 = value.total;
                    else if (key === 'images') v2 = <img alt="profilePic" src={value[0].url} height="100"/>;
                    tab.push(
                        <tr key={key + '-row'} className="user-table-row">
                            <td key={key} className="user-table-col">{key}</td>
                            <td key={key + '-val'} className="user-table-col">{v2}</td>
                        </tr>
                    );
                } else
                    tab.push(
                        <tr key={key + '-row'} className="user-table-row">
                            <td key={key} className="user-table-col">{key}</td>
                            <td key={key + '-val'} className="user-table-col">{value}</td>
                        </tr>
                    );
            }
            this.setState({ userInfo: tab });
        }
    }

    render() {
        return (
            <div className="User">
                <table><tbody>{this.state.userInfo}</tbody></table>
            </div>
        );
    }
}

export default connect((state) => ({ userData: getUserData(state) }), null)(User);
