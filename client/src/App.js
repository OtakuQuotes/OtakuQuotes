import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import Search from './components/search.js';
import Random from './components/random.js';
import Submit from './components/submit.js';
import Navmenu from './components/navmenu.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
        <Router>
            <div className="App">
            <Navmenu/>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/search' component={Search} />
                <Route path='/about' component={About}/>
                {/* <Route path='/docs' component={Docs}/> */}
                <Route path='/submit' component={Submit}/>
                <Route component={NoMatch} />
            </Switch>
            </div>
        </Router>
        );
    }
}

const Home = () => (
    <div>
        <section className="hero is-medium">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title is-dark is-1 is-size-1">
                        OtakuQuotes
                    </h1>
                    <h2 className="subtitle is-dark is-size-3">
                        A RESTful API to grab your favorite quotes from Nihon Anime!
                    </h2>
                    <br />
                    <Random />
                    <br />
                    <p className="hero-buttons">
                        <Link to='/search' className="button is-mainbutton is-large is-capitalized is-size-4">
                        <span>Try It Out!</span>
                        </Link>
                        <Link to='/docs' className="button is-secondbutton is-large is-capitalized is-size-4">
                        <span>View Docs</span>
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    </div>
)

const About = () => (
    <section className="hero">
        <div className="hero-body">
            <div className="container is-dark">
                <h1 className="is-size-1 title">
                    About OtakuQuotes
                </h1>
                <h1 className="is-size-4 subtitle">
                    OtakuQuotes was built
                </h1>
            </div>
        </div>
    </section>
);

const Docs = () => (
    <section className="hero">
        <div className="hero-body">
            <div className="container has-text-centered is-dark">
                <h1 className="is-size-1 title">
                    501
                </h1>
                <h1 className="is-size-4 subtitle">
                    Docs aren't here yet. But you can visit <a href="https://github.com/xNinjaKittyx/OtakuQuotes">GitHub</a> for the temporary solution.
                </h1>
            </div>
        </div>
    </section>
);

const NoMatch = () => (
    <section className="hero">
        <div className="hero-body">
            <div className="container has-text-centered is-dark">
                <h1 className="is-size-1 title">
                404
                </h1>
                <h1 className="is-size-4 subtitle">
                Websites die when they are killed.
                </h1>
            </div>
        </div>
    </section>
);

export default App;