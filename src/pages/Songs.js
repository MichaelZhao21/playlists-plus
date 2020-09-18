import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { nextSongPage, retrieveSongs } from '../components/spotify-middleware';
import { getStoredPlaylists, getUserData } from '../redux/selectors';

class Songs extends React.Component {
    constructor() {
        super();
        this.state = {
            songList: (
                <tr>
                    <td>
                        <h2 style={{ textAlign: 'center' }}>Loading...</h2>
                    </td>
                </tr>
            ),
        };
    }

    moreItems = (id, url) => {
        nextSongPage(id, url).then((data) => {
            var songList = this.state.songList;
            songList.pop();
            data.items.forEach((item) => {
                songList.push(this.createRowItem(item.track));
            });
            if (data.next) songList.push(this.addLoadMoreRow(id, data.next));
            this.setState({ songList: null });
            this.setState({ songList });
        });
    };

    createRowItem = (track) => {
        return (
            <tr key={track.id + '-row'} className="table-row">
                <td className="table-col songs-table-col" key={track.id + '-title'}>
                    {track.name}
                </td>
                <td className="table-col songs-table-col" key={track.id + '-artist'}>
                    {track.artists[0].name}
                </td>
                <td className="table-col songs-table-col" key={track.id + '-album'}>
                    {track.album.name}
                </td>
                <td className="table-col songs-table-col" key={track.id + '-duration'}>
                    {track.duration_ms / 1000.0 + ' s'}
                </td>
            </tr>
        );
    };

    addLoadMoreRow = (id, next) => {
        return (
            <tr key="next" className="table-row" onClick={() => this.moreItems(id, next)}>
                <td className="table-col songs-table-col a" colSpan={4} key={'next-link'}>
                    Load more playlists...
                </td>
            </tr>
        );
    };

    componentDidMount() {
        if (this.props.userData === null) {
            this.setState({ songList: <Redirect push to="/" /> });
        } else if (this.props.playlists === null) {
            this.setState({ songList: <Redirect to="/playlists" /> });
        } else {
            retrieveSongs(this.props.match.params.id).then((data) => {
                console.log(data);
                var songList = [];
                data.items.forEach((item) => {
                    songList.push(this.createRowItem(item.track));
                });
                if (data.next) songList.push(this.addLoadMoreRow(this.props.match.params.id, data.next));
                this.setState({ songList });
            });
        }
    }

    render() {
        return (
            <div className="Songs">
                <table>
                    <tbody>
                        <tr className="table-row">
                            <th className="songs-table-col">Title</th>
                            <th className="songs-table-col">Artist</th>
                            <th className="songs-table-col">Album</th>
                            <th className="songs-table-col">Duration</th>
                        </tr>
                        {this.state.songList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(
    (state) => ({ userData: getUserData(state), playlists: getStoredPlaylists(state) }),
    null
)(Songs);
