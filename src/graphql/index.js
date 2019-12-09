const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const context = ({ req }) => {
    return {
        user: {
            userId: '5ded787d0ea584c3dd89ddc0',
            isLoggedIn: true,
        },
    };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
});

module.exports = server;
