import React from 'react';
import classNames from 'classnames';

const Match = ({ data }) => {
    const {
        eventName,
        spilt,
        h,
        b,
        eventStatus,
        match: {
            competitor1,
            competitor2,
        },
    } = data;

    const finished = eventStatus === 'finished';

    const guess = `${h} - ${b}`;
    const result = finished ? `${competitor1.score} - ${competitor2.score}` : '';

    return (
        <tr
            className={classNames(
                'tr',
                { 'tr--red': finished && guess !== result},
                { 'tr--green': finished && guess === result}
            )}
        >
            <td className="td">
                {eventName}
            </td>
            <td className="td">
                {spilt &&
                    <span>
                        {guess}
                    </span>
                }
            </td>
            <td className="td">
                {finished &&
                    <span>
                        {result}
                    </span>
                }
            </td>
        </tr>
    );
}

export default Match;
