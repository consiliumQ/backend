require('dotenv').config();
const server = require('./graphql');
const { seed } = require('./database');

seed()
    .then(() => console.log('seeding succeeded'))
    .catch(e => console.log('seeding failed', e));

server.listen().then(({ url }) => console.log(`ConsiliumQ backend service running on ${url}`));
