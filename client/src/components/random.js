import React, { Component } from 'react';

class Random extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requestFailed: false,
            transitionFade: false
        };
        this.tick = this.tick.bind(this);
    }

    tick() {
        this.setState({transitionFade: false})
        fetch('/api/random')
            .then(response => {
                if (!response.ok) {
                    throw Error("Network request failed")
                }
                return response
            })
            .then(d => d.json())
            .then(d => {
                this.setState({
                    quotes: d, transitionFade: true
                })
                // console.log(this.state);
            })
    }

    componentDidMount() {
        this.tick();
        this.interval = setInterval(this.tick, 5000);
        
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let fadestate = this.state.transitionFade ? "topkek" : "topkekhide"
        if (this.state.requestFailed) return <div className="topkek"><h2 className="subtitle is-3 is-size-4">"Websites die when they are killed."</h2><h2 className="subtitle is-6">- 404</h2></div>
        if (!this.state.quotes) return <div className="topkek"><a className="button is-link is-loading">loading</a></div>
        return (
            <div className="container">
                <div className={fadestate}>
                    <h2 className="subtitle is-5">"{this.state.quotes.quotes.quote}"</h2>
                    <h2 className="subtitle is-6">- <i>{this.state.quotes.quotes.char}</i></h2>
                </div>
            </div>
        );
    }
}

export default Random;