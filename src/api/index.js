const LEAGUE_URL = 'https://www.vg.no/spesial/2018/fotball-vm/api/hent_liga.php?liga=56e56251c0ff2001546b6fb768101933';
const MATCH_URL = (id) => `https://redutv-api.vg.no/sports/fotball-vm-2018/kamp/${id}`;

export const getLeague = () =>
    fetch(LEAGUE_URL).then(resp => resp.json());

export const getMatch = (id) =>
    fetch(MATCH_URL(id)).then(resp => resp.json());
