const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const {getUser, getUserIdFromToken} = require("../authentication/auth");

const context = async ({ req }) => {
    const [, token] = (req.headers.authorization || '').split("Bearer ");

    return {
        user: await getUser(await getUserIdFromToken(token)),
    };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
});

module.exports = server;
