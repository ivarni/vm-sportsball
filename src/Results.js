import React, { Fragment } from 'react';

import Match from './Match';

const Results = ({ tipping, matches }) => {
    return (
        <Fragment>
            <h2>
                {tipping.navn}
            </h2>
            <table className="table">
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
                    {tipping
                        .tipping
                        .map(match => {
                            const matchData = matches.find(
                                m => m.id === match.id
                            );
                            return (
                                <Match
                                    key={match.id}
                                    data={{
                                        ...match,
                                        ...matchData
                                    }}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
        </Fragment>
    );
}

export default Results;
