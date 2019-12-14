const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { dummyUser } = require('../database');
const { getUser, getUserIdFromToken } = require('../authentication/auth');

const context = async ({ req }) => {
    const [, token] = (req.headers.authorization || '').split('Bearer ');
    await getUser(await getUserIdFromToken(token));
    return {
        user: token ? await getUser(await getUserIdFromToken(token)) : await dummyUser(),
    };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    // cors: true,
});

module.exports = server;
