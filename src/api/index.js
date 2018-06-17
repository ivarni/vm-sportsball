import 'whatwg-fetch';

const LEAGUE_URL = 'https://www.vg.no/spesial/2018/fotball-vm/api/hent_liga.php?liga=56e56251c0ff2001546b6fb768101933';

export const getLeague = () =>
    fetch(LEAGUE_URL).then(resp => resp.json());
