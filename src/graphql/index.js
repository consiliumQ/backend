const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { getUser, getUserIdFromToken } = require('../authentication/auth');

const context = async ({ req }) => {
    const [, token] = (req.headers.authorization || '').split('Bearer ');
    if (token) {
        return { user: {
           userId: (await getUser(await getUserIdFromToken(token)))._id,
           isLoggedIn: true }} 
    } else {
        return { user: {
            userId: process.env.DUMMY_USER_ID,
            isLoggedIn: true,
        }}

    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
});

module.exports = server;

