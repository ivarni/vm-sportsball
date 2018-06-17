const LEAGUE_URL = '/api/league';
const MATCH_URL = (id) => `/api/match/${id}`;

export const getLeague = () =>
    fetch(LEAGUE_URL).then(resp => resp.json());

export const getMatch = (id) =>
    fetch(MATCH_URL(id)).then(resp => resp.json());
