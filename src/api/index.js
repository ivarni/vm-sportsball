let LEAGUE_URL = '/api/league';
let MATCH_URL = (id) => `/api/match/${id}`;
let GUESS_URL = (id) => `/api/guess/${id}`;
let ALL_MATCHES_URL = '/api/allmatches';

if (process.env.NODE_ENV === 'development') {
    /*
       Commence horrible hack, if we're running directly from webpack,
       there'll be no API server running so there's nothing that will proxy
       these requests.

       It may or may not work to go directly against the original API,
       it depends on the browser being used, so we can at least try.
    */
    LEAGUE_URL = 'https://www.vg.no/spesial/2018/fotball-vm/api/hent_liga.php?liga=56e56251c0ff2001546b6fb768101933';
    MATCH_URL = (id) => `https://redutv-api.vg.no/sports/fotball-vm-2018/kamp/${id}`;
    GUESS_URL = (id) => `https://www.vg.no/spesial/2018/fotball-vm/api/hent_tipping.php?id_public=${id}`;
    ALL_MATCHES_URL = 'https://redutv-api.vg.no/sports/fotball-vm-2018/kampene';
}

export const getAllMatches = () =>
    fetch(ALL_MATCHES_URL).then(resp => resp.json());

export const getLeague = () =>
    fetch(LEAGUE_URL).then(resp => resp.json());

export const getMatch = (id) =>
    fetch(MATCH_URL(id)).then(resp => resp.json());

export const getGuess = (id) =>
    fetch(GUESS_URL(id)).then(resp => resp.json().then((json) => {json.id_public=id; return json}));
