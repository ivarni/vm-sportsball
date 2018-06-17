import React, { Component, Fragment } from 'react';
import { decode } from 'he';

import { getLeague, getMatch } from './api';

import './App.css';
class App extends Component {

    constructor() {
        super();

        this.state = {
            id_selected: null,
            list: [],
            matches: [],
        }
    }

    async componentDidMount() {
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
    }

    render() {
        const {
            id_selected,
            list,
            matches,
        } = this.state;

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
                    <Fragment>
                        <h2>
                            {list.find(p => p.id_public === id_selected).navn}
                        </h2>
                        <table>
                            <thead>
                                <tr className="tr">
                                    <th className="th">
                                        Kamp
                                    </th>
                                    <th className="th">
                                        Tippet
                                    </th>
                                    <th className="th">
                                        Resultat
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {list
                                    .find(p => p.id_public === id_selected)
                                    .tipping
                                    .map(match => {
                                        const matchData = matches.find(m => m.id === match.id);
                                        return (
                                            <tr
                                                key={match.id}
                                                className="tr"
                                            >
                                                <td className="td">
                                                    {matchData.eventName}
                                                </td>
                                                <td className="td">
                                                    {match.spilt &&
                                                        <span>
                                                            {match.h} - {match.b}
                                                        </span>
                                                    }
                                                </td>
                                                <td className="td">
                                                    {matchData.eventStatus === 'finished' &&
                                                        <span>
                                                            {matchData.match.competitor1.score} - {matchData.match.competitor2.score}
                                                        </span>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </Fragment>
                }
            </div>
        );
    }
}

export default App;
