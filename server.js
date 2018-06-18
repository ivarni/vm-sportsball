require('isomorphic-fetch');

const path = require('path');
const express = require('express');

const LEAGUE_URL = 'https://www.vg.no/spesial/2018/fotball-vm/api/hent_liga.php?liga=56e56251c0ff2001546b6fb768101933';
const MATCH_URL = (id) => `https://redutv-api.vg.no/sports/fotball-vm-2018/kamp/${id}`;
const GUESS_URL = (id) => `https://www.vg.no/spesial/2018/fotball-vm/api/hent_tipping.php?id_public=${id}`;
const ALL_MATCHES_URL = 'https://redutv-api.vg.no/sports/fotball-vm-2018/kampene';

const app = express();

const root = path.join(__dirname, 'build');

app.use('/api/league', (req, res) => {
    fetch(LEAGUE_URL)
        .then(resp => resp.json())
        .then(json => res.json(json));
});

app.use('/api/allmatches', (req, res) => {
    fetch(ALL_MATCHES_URL)
        .then(resp => resp.json())
        .then(json => res.json(json));
});

app.use('/api/match/:id', (req, res) => {
    fetch(ALL_MATCHES_URL(req.params.id))
        .then(resp => resp.json())
        .then(json => res.json(json));
});

app.use('/api/guess/:id', (req, res) => {
    fetch(GUESS_URL(req.params.id))
        .then(resp => resp.json())
        .then(json => res.json(json));
});

app.use(express.static(root));

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), () => {
    console.log(`App listening on ${app.get('port')}`);
})
