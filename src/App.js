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
                list: list.map(l => ({
                    ...l,
                    tipping: l.tipping.map(tipping => {
                        const match = matches.find(m => m.id === tipping.id);
                        const guess = `${tipping.h} - ${tipping.b}`;
                        const finished = match.eventStatus === 'finished';
                        const { competitor1, competitor2 } = match.match; // derp
                        const guessOutcome = tipping.h === tipping.b ? 'U' : tipping.h > tipping.b ? 'H' : 'B'
                        const actualOutcome = competitor1.score === competitor2.score ? 'U' : competitor1.score > competitor2.score ? 'H' : 'B'

                        const result = finished ?  `${competitor1.score} - ${competitor2.score}` : '';
                        return {
                            ...tipping,
                            guess,
                            finished,
                            result,
                            correct: finished && guess === result,
                            correctOutcome: finished && guessOutcome === actualOutcome,
                            wrong: finished && guess !== result && guessOutcome !== actualOutcome,
                        };
                    }),
                })).map(l => ({
                    ...l,
                    score:  l.tipping.filter(t => t.correctOutcome).map(t => t.correct ? 2 : 1).reduce((a,s) => a+s),
                })).sort(
                    (a, b) => (a.score === b.score) ? 0 :
                        (a.score < b.score) ? 1 : -1
                ),
                matches,
            });
        } catch (e) {
            console.error(e);
            this.setState({ hasError: true });
        }

    }

    componentDidCatch(e) {
        console.error(e);
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

        if (!list.length) {
            return (
                <p>Pausemusikk</p>
            );
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
                            ({p.score})
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
