import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { nextPlaylistPage, retrievePlaylists } from '../components/spotify-middleware';
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

    clickPlaylist = (playlistId) => {
        this.setState({ pl: <Redirect to={"/songs/" + playlistId} /> });
    };

    moreItems = (url) => {
        nextPlaylistPage(url).then((data) => {
            var pls = this.state.pl;
            pls.pop();
            data.items.forEach((item) => {
                pls.push(this.createRowItem(item));
            });
            if (data.next) pls.push(this.addLoadMoreRow(data.next));
            this.setState({ pl: null });
            this.setState({ pl: pls });
        });
    };

    createRowItem = (item) => {
        return (
            <tr
                key={item.id + '-row'}
                className="table-row"
                onClick={() => this.clickPlaylist(item.id)}
            >
                <td className="table-col playlists-table-col" key={item.id + '-name'}>
                    {item.name}
                </td>
                <td className="table-col playlists-table-col" key={item.id + '-count'}>
                    {item.tracks.total}
                </td>
                <td className="table-col playlists-table-col" key={item.id + '-owner'}>
                    {item.owner.id}
                </td>
            </tr>
        );
    };

    addLoadMoreRow = (next) => {
        return (
            <tr key="next" className="table-row" onClick={() => this.moreItems(next)}>
                <td className="table-col playlists-table-col a" colSpan={3} key={'next-link'}>
                    Load more playlists...
                </td>
            </tr>
        );
    };

    componentDidMount() {
        if (this.props.userData === null) {
            this.setState({ pl: <Redirect push to="/" /> });
        } else {
            retrievePlaylists().then((data) => {
                var pls = [];
                data.items.forEach((item) => {
                    pls.push(this.createRowItem(item));
                });
                if (data.next) pls.push(this.addLoadMoreRow(data.next));
                this.setState({ pl: pls });
            });
        }
    }

    render() {
        return (
            <div className="Playlists">
                <table>
                    <tbody>
                        <tr className="table-row">
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
