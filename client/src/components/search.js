import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

const AnimeList = (kek) => (
    <div className="box">
        <article className="media">
        <figure className="media-left">
            <div className="thumbcontainer">
                <img src={kek.kek.img} className="thumbnail" alt={kek.kek.id}/>
            </div>
        </figure>
        <div className="media-content">
            <div className="content">
            <p>
                <strong>{kek.kek.char}</strong> <small>{kek.kek.anime}</small>
                <br />
                "{kek.kek.quote}"
            </p>
            </div>
        </div>
        </article>
    </div>
);

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
        current: ''
        };
    }

    componentWillMount() {
        this.search(this.props.location.state.initial);
        this.setState({current: this.props.location.state.initial});
    }

    componentDidUpdate() {
        if (this.state.current !== this.props.location.state.initial) {
        this.search(this.props.location.state.initial);
        this.setState({current: this.props.location.state.initial});
        }
    }

    search(query) {
        axios.get(`/api/quotes?tags=${query}`)
        .then((response) => {
            this.setState({list: response.data.quotes}, function(){
            // console.log(this.state);
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    textChange(){
        this.search(this.refs.query.value);
    }

    render() {
        if (!this.state.list) return <div className="container has-text-centered"><a className="button is-large is-link is-loading">loading</a></div>
        var quotelist = _.map(this.state.list, (x) => {
        return <AnimeList key={x.id} kek={x} />
        });
        return (
        <div>
            <div className="columns is-mobile">
                <div className="column is-half is-offset-one-quarter">
                    <br />
                    <div className="field">
                        <div className="control">
                            <input ref="query" onChange={ (e) => { this.textChange(); } } type="text" className="input is-medium"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
            {quotelist}
            </div>
        </div>
        );
    }
}

export default Search;