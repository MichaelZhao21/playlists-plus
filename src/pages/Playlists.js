import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { getUserPlaylists } from '../components/spotify-api';
import { getUserData } from '../redux/selectors';

class Playlists extends React.Component {
    constructor() {
        super();
        this.state = {
            pl: (
                <tr>
                    <td>
                        <h2 style={{ textAlign: 'center' }}>Loading...</h2>
                    </td>
                </tr>
            ),
        };
    }

    clickPlaylist = (id) => {};

    moreItems = (url) => {
        console.log(url);
    };

    createRowItem = (item) => {
        return (
            <tr
                key={item.id + '-row'}
                className="user-table-row"
                onClick={() => this.clickPlaylist(item.id)}
            >
                <td className="user-table-col playlists-table-col" key={item.id + '-name'}>
                    {item.name}
                </td>
                <td className="user-table-col playlists-table-col" key={item.id + '-count'}>
                    {item.tracks.total}
                </td>
                <td className="user-table-col playlists-table-col" key={item.id + '-owner'}>
                    {item.owner.id}
                </td>
            </tr>
        );
    };

    componentDidMount() {
        if (this.props.userData === null) {
            this.setState({ userInfo: <Redirect push to="/" /> });
        } else {
            getUserPlaylists().then((data) => {
                var pls = [];
                data.items.forEach((item) => {
                    pls.push(this.createRowItem(item));
                });
                if (data.next) {
                    pls.push(
                        <tr
                            key="next"
                            className="user-table-row"
                            onClick={() => this.moreItems(data.next)}
                        >
                            <td
                                className="user-table-col playlists-table-col a"
                                colSpan={3}
                                key={'next-link'}
                            >
                                Load more playlists...
                            </td>
                        </tr>
                    );
                }
                this.setState({ pl: pls });
            });
        }
    }

    render() {
        return (
            <div className="Playlists">
                <table>
                    <tbody>
                        <tr className="user-table-row">
                            <th className="playlists-table-col">Name</th>
                            <th className="playlists-table-col">Songs</th>
                            <th className="playlists-table-col">Owner</th>
                        </tr>
                        {this.state.pl}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect((state) => ({ userData: getUserData(state) }), null)(Playlists);
