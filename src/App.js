import React, { Component, Fragment } from 'react';
import { decode } from 'he';

import { getLeague } from './api';

import './App.css';
class App extends Component {

    constructor() {
        super();

        this.state = {
            id_selected: null,
            list: [],
        }
    }

    async componentDidMount() {
        const league = await getLeague();

        this.setState({
            list: league.liste.map(p => ({
                ...p,
                tipping: JSON.parse(p.tipping)
            })),
        });
    }

    render() {
        const {
            list,
            id_selected,
        } = this.state;

        if (list.length) {
            console.log(list[0].tipping)
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
                                        Resultat
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {list
                                    .find(p => p.id_public === id_selected)
                                    .tipping
                                    .map(match => (
                                        <tr
                                            key={match.id}
                                            className="tr"
                                        >
                                            <td className="td">
                                                {match.id}
                                            </td>
                                            {match.spilt &&
                                                <td className="td">
                                                    {match.h} - {match.b}
                                                </td>
                                            }
                                        </tr>
                                    ))
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
