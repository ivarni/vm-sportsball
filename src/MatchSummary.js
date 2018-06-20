import React, { Fragment } from 'react';
import { decode } from 'he';
import classNames from 'classnames';

const MatchSummary = ({ match, players }) => {
    return (
        <Fragment>
            <h2>
                Tipping på {match.eventName}
            </h2>
            <table className="table">
                <thead>
                    <tr className="tr">
                        <th className="th">
                            Spiller
                        </th>
                        <th className="th">
                            Tippet
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        players.map (p => {
                            const matchGuess = p.tipping.find(t => t.id === match.id);
                            return (
                                <tr key={p.id_public} className={classNames('tr',
                                    { 'tr--red': matchGuess.wrong},
                                    { 'tr--green': matchGuess.correct},
                                    { 'tr--lightgreen': matchGuess.correctOutcome && !matchGuess.correct},
                                    { 'tr--live': !matchGuess.finished})}>
                                    <td >{decode(p.navn)}</td><td>{matchGuess.h} - {matchGuess.b}</td></tr>)
                        })
                        
                    }
                </tbody>
            </table>
        </Fragment>
    );
}

export default MatchSummary;
