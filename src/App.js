import React, { Component } from 'react';
import { decode } from 'he';

import { getLeague, getMatch } from './api';

import Results from './Results';

import './App.css';

class App extends Component {

    constructor() {
        super();

        this.state = {
            hasError: false,
            id_selected: null,
            list: [],
            matches: [],
        }
    }

    async componentDidMount() {
        try {
            const league = await getLeague();

            const list = league.liste.map(p => ({
                ...p,
                tipping: JSON.parse(p.tipping)
            }));

            const match_ids = new Set(
                JSON.parse(league.liste[0].tipping).map(match => match.id)
            );

            const matches = await Promise.all([...match_ids].map(
                async (id) => getMatch(id)
            ))

            this.setState({
                list,
                matches,
            });
        } catch (e) {
            this.setState({ hasError: true });
        }

    }

    componentDidCatch() {
        this.setState({ hasError: true });
    }

    render() {
        const {
            hasError,
            id_selected,
            list,
            matches,
        } = this.state;

        if (hasError) {
            return (
                <p>Noe gikk til hælvette, prøv en annen browser eller noe</p>
            )
        }

        return (
            <div className="app">
                <h1>
                    Scelto VM-liga
                </h1>
                <ul className="ul">
                    {list.map(p => (
                        <li
                            key={p.id_public}
                            className="li"
                        >
                            <button
                                className="button"
                                onClick={() => this.setState({
                                    id_selected: p.id_public,
                                })}
                            >
                                {decode(p.navn)}
                            </button>
                        </li>
                    ))}
                </ul>
                {id_selected &&
                    <Results
                        tipping={list.find(p => p.id_public === id_selected)}
                        matches={matches}
                    />
                }
            </div>
        );
    }
}

export default App;
