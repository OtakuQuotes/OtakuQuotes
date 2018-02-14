import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class Navmenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navmenuOpen: false,
            value: '',
            fireRedirect: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClick() {
        this.setState({
        navmenuOpen: !this.state.navmenuOpen,
        });
    }

    handleChange(event) {
        this.setState({value: event.target.value})
        this.setState({fireRedirect: false});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({fireRedirect: true});
    }

    render() {
        let openstate = this.state.navmenuOpen ? "navbar-menu is-active" : "navbar-menu"

        return (
        <div>
            <nav className="navbar navigation">
                <div className="container">
                    <div className="navbar-brand">
                        <Link to='/' className="navbar-item is-dark is-size-4"><img src="/android-chrome-512x512.png" alt="The Best Anime Quotes Around"/><b>OtakuQuotes</b></Link>
                        <form onSubmit={this.handleSubmit}>
                            <div className="field has-addons controltop">
                                <div className="control">
                                    <input className="input" placeholder="Search" value={this.state.value} onChange={this.handleChange}/>
                                </div>
                                <div className="control">
                                    <a className="button is-dark" type="submit" onClick={this.handleSubmit}>
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-search"></i>
                                    </span>
                                    </a>
                                </div>
                            </div>
                        </form>

                        <div className="navbar-burger is-dark" onClick={this.handleClick}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className={openstate}>
                        <div className="navbar-end">
                            <Link to='/about' className="navbar-item is-dark">About</Link>
                            <a href='/docs' className="navbar-item is-dark">Docs</a>
                            <Link to='/submit' className="navbar-item is-dark">Submit</Link>
                            <span className="navbar-item">
                            <a className="button is-success" href="https://github.com/xNinjaKittyx/OtakuQuotes">
                                <span className="icon">
                                <i className="fa fa-github"></i>
                                </span>
                                <span>Github</span>
                            </a>
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {
                this.state.fireRedirect &&
                <Redirect to={{
                pathname: '/search',
                state: { initial: this.state.value },
                search: '?=' + this.state.value
                }} />
            }

        </div>
        );
    }
}

export default Navmenu;