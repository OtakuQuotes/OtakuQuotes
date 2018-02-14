import React, { Component } from 'react';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

class Submit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anime: '',
            character: '',
            quote: '',
            episode: '',
            submitter: '',
            recaptchatoken: '',
            animeValid: false,
            characterValid: false,
            quoteValid: false,
            episodeValid: false,
            submitterValid: false,
            formValid: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCaptcha = this.handleCaptcha.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.alterFormClass = this.alterFormClass.bind(this);
    }

    handleSubmit(event) {
        if(!this.state.formValid) {
            return;
        }
        event.preventDefault();

        const animeS = this.state.anime.trim();
        const charS = this.state.character.trim();
        const quoteS = this.state.quote.trim();
        const episodeS = this.state.episode.trim();
        const submitterS = this.state.submitter.trim();
        const captchaS = this.state.recaptchatoken;

        axios.post('/api/submit', {
            anime: animeS,
            char: charS,
            quote: quoteS,
            episode: episodeS,
            submitter: submitterS,
            captcha: captchaS
        })
        .then((response) => {
            alert(response.data.message);
            window.location.reload(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleCaptcha(value) {
        this.setState({
            recaptchatoken: value
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({[name]: value},
            () => { this.validateForm(name, value)}
        );
    }

    validateForm(fieldName, value) {
        let animeValid = this.state.animeValid;
        let characterValid = this.state.characterValid;
        let quoteValid = this.state.quoteValid;
        let episodeValid = this.state.episodeValid;
        let submitterValid = this.state.submitterValid;

        const regex = /^([\w.%+-]+)/;

        switch(fieldName) {
            case 'anime':
                animeValid = regex.test(value);
                break;
            case 'character':
                characterValid = regex.test(value);
                break;
            case 'quote':
                quoteValid = regex.test(value);
                break;
            case 'episode':
                episodeValid = !isNaN(parseFloat(value)) && isFinite(value);
                break;
            case 'submitter':
                submitterValid = regex.test(value);
                break;
            default:
                break;
        }
        this.setState({
            animeValid: animeValid,
            characterValid: characterValid,
            quoteValid: quoteValid,
            episodeValid: episodeValid,
            submitterValid: submitterValid
        }, this.validateCheck);
    }

    validateCheck() {
        this.setState({
            formValid: this.state.animeValid && this.state.characterValid && this.state.quoteValid && this.state.episodeValid && this.state.submitterValid
        });
    }

    alterFormClass(name) {
        const validname = name + 'Valid';
        if(this.state[name] === '') {
            return 'input'
        } else if (this.state[validname] === true) {
            return 'input is-success'
        } else {
            return 'input is-danger'
        }
    }

    alterTextAreaClass() {
        if(this.state.quote === '') {
            return 'textarea'
        } else if (this.state.quoteValid === true) {
            return 'textarea is-success'
        } else {
            return 'textarea is-danger'
        }
    }

    render() {
        return (
        <div className="container">
            <form onSubmit={this.handleSubmit}>
                <div className="columns is-mobile">
                    <div className="column is-7">
                        <br />
                        <h1 className="title">Submit a quote!</h1>
                        <div className="field">
                        <label className="label">Anime</label>
                            <div className="control">
                                <input
                                    className={ this.alterFormClass('anime') }
                                    type="text"
                                    placeholder="Name of anime"
                                    name="anime"
                                    value={this.state.anime}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                        <label className="label">Character</label>
                            <div className="control">
                                <input
                                    className={ this.alterFormClass('character') }
                                    type="text"
                                    placeholder="Name of character"
                                    name="character"
                                    value={this.state.character}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                        <label className="label">Quote</label>
                            <div className="control">
                                <textarea
                                    className={ this.alterTextAreaClass() }
                                    placeholder="Quote"
                                    name="quote"
                                    value={this.state.quote}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                        <label className="label">Episode</label>
                            <div className="control">
                                <input
                                    className={ this.alterFormClass('episode') }
                                    type="text"
                                    placeholder="Episode number"
                                    name="episode"
                                    value={this.state.episode}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                        <label className="label">Submitter</label>
                            <div className="control">
                                <input
                                    className={ this.alterFormClass('submitter') }
                                    type="text"
                                    placeholder="Name of submitter"
                                    name="submitter"
                                    value={this.state.submitter}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <div className="control">
                                <ReCAPTCHA
                                    ref="recaptcha"
                                    sitekey="6LfX7TEUAAAAAHVR4_KHGZCIiP0bvJwLfdKL_AuJ"
                                    onChange={this.handleCaptcha}
                                />
                                {/*<div ref="captcha" className="g-recaptcha" data-sitekey="6LfX7TEUAAAAAHVR4_KHGZCIiP0bvJwLfdKL_AuJ">*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-primary" onClick={this.handleSubmit}>Submit</button>
                            </div>
                            <div className="control">
                                <button className="button is-danger">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div className="column is-5">
                        <br />
                        <h2 className="subtitle">Submission Guidelines:</h2>
                        <br />
                        <ol>
                            <li>Please only use ASCII-compliant characters for now.</li>
                            <li>No NSFW Quotes. This includes quotes originating from explicit anime.</li>
                            <li>Feel free to submit as many or as little as you'd like.</li>
                            <li>If you cannot include an episode number, please enter 0.</li>
                            <li>Submitter cannot be left blank, but feel free to leave it as Anon.</li>
                        </ol>
                    </div>
                </div>
            </form>
        </div>
        );
    }
}

export default Submit;