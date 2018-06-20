import React from 'react';
import classNames from 'classnames';

const Match = ({ app, data }) => {
    const {
        eventName,
        spilt,
        finished,
        inProgress,
        guess,
        result,
        correct,
        correctOutcome,
        wrong,
        match
    } = data;

    return (
        <tr
            className={classNames(
                'tr',
                { 'tr--red': wrong},
                { 'tr--green': correct},
                { 'tr--lightgreen': correctOutcome && !correct},
                { 'tr--live': !finished},
            )}
        >
            <td >
                 
                <button
                    className="button2"
                    onClick={() => app.setState({
                        match_selected: match.id
                    })}>
                    {eventName}
                </button>
            </td>
            <td >
                {spilt &&
                    <span>
                        {guess}
                    </span>
                }
            </td>
            <td >
                {(finished || inProgress) &&
                    <span>
                        {result}
                    </span>
                }
            </td>
        </tr>
    );
}

export default Match;
