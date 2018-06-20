import React, { Component } from 'react';
import { decode } from 'he';

import { getLeague, getGuess, getAllMatches } from './api';

import Results from './Results';
import MatchSummary from './MatchSummary';
import Spinner from './Spinner';

import './App.css';

class App extends Component {

    constructor() {
        super();

        this.state = {
            hasError: false,
            id_selected: null,
            list: [],
            matches: [],
            match_selected: null
        }
    }

    async componentDidMount() {
        try {
            const league = await getLeague();
            
            const player_ids = league.liste.map(p => p.id_public)
            const playerGuesses = await Promise.all([...player_ids].map(
                async (id) => getGuess(id) 
            ))
            
            const playerGuessesDecoded = playerGuesses.map(p => ({...p, tipping: JSON.parse(p.tipping)}))
            const matches = (await getAllMatches()).filter(m => m.eventStatus === "finished" || m.eventStatus === "inProgress")

            this.setState({
                list: playerGuessesDecoded.map(l => ({
                    ...l,
                    tipping: l.tipping.map(tipping => {
                        const match = matches.find(m => m.id === tipping.id);
                        const guess = `${tipping.h} - ${tipping.b}`;
                        const finished = match && match.eventStatus === 'finished';
                        const startTime = match.start;
                        const inProgress = match && match.eventStatus === 'inProgress';
                        const { competitor1, competitor2 } = match.match; // derp
                        const guessOutcome = tipping.h === tipping.b ? 'U' : tipping.h > tipping.b ? 'H' : 'B'
                        const actualOutcome = competitor1.score === competitor2.score ? 'U' : competitor1.score > competitor2.score ? 'H' : 'B'

                        const result = finished || inProgress ?  `${competitor1.score} - ${competitor2.score}` : '';
                        return {
                            ...tipping,
                            guess,
                            finished,
                            inProgress,
                            result,
                            correct: finished && guess === result,
                            correctOutcome: finished && guessOutcome === actualOutcome,
                            wrong: finished && guess !== result && guessOutcome !== actualOutcome,
                            startTime,
                        };
                    }).sort((t1, t2) => {return t2.startTime.localeCompare(t1.startTime)})
                })).map(l => ({
                    ...l,
                    score:  l.tipping.filter(t => t.correctOutcome).map(t => t.correct ? 2 : 1).reduce((a,s) => a+s),
                    correct: l.tipping.filter(t => t.correct).length
                })).sort(
                    (a, b) => {
                        if(a.score === b.score && a.correct === b.correct) {
                            console.log (`navn compare ${a.navn} ${a.score} ${a.correctOutcome}-${b.navn} ${b.score} ${b.correctOutcome} `)
                            return b.navn.localeCompare(a.navn)
                        } else if (a.score === b.score) {
                            console.log (`score compare ${a.navn} ${a.score} ${a.correctOutcome}-${b.navn} ${b.score} ${b.correctOutcome} `)
                            return b.correct - a.correct;
                        } else {
                            console.log (`score compare ${a.navn} ${a.score} ${a.correctOutcome}-${b.navn} ${b.score} ${b.correctOutcome} `)
                            return b.score - a.score;
                        }
                    })
                .map((p, idx, all) => ({
                    ...p,
                    placement: this.findPlacement(all, idx)
                })),
                matches
            });
        } catch (e) {
            console.error(e);
            this.setState({ hasError: true });
        }

    }

    findPlacement(all, idx) {
        if(idx === 0) {
            return 1
        } 

        return all[idx - 1].score === all[idx].score ? this.findPlacement(all, idx -1) : idx + 1
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
            match_selected
        } = this.state;

        if (hasError) {
            return (
                <p>Noe gikk til hælvette, prøv en annen browser eller noe</p>
            )
        }

        if (!list.length) {
            return (
                <Spinner />
            );
        }

        return (
            <div className="app">                
                <h1>
                    Scelto VM-liga
                </h1>
                <div className="flexit">
                    <div className="box">
                        <h2>Tabell</h2>    
                        <table id="liga" className="table">
                            <thead>
                                <tr className="tr">
                                    <th className="th">#</th>
                                    <th className="th">Navn</th>
                                    <th className="th">Poeng</th>
                                </tr>
                            </thead>
                            <tbody>
                            {list.map(p => (
                                <tr key={p.id_public} className="tr">
                                    <td className="placement">{p.placement}.</td>
                                    <td>
                                    <button
                                        className="button"
                                        onClick={() => this.setState({
                                            id_selected: p.id_public,
                                        })}
                                    >
                                        {decode(p.navn)}
                                    </button>
                                    </td>
                                    <td className="placement">{p.score} ({p.correct})</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div id="playerInfo" className="box">
                        {id_selected &&
                            <Results
                                app = {this}
                                tipping={list.find(p => p.id_public === id_selected)}
                                matches={matches}
                            />
                        }
                    </div>
                    <div id="matchSummary" className="box">
                        {match_selected &&
                            <MatchSummary
                                match={matches.find(m => m.id === match_selected)}
                                players={list}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
