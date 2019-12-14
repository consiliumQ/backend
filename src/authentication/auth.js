// const fetch = require('node-fetch');
// const { AuthenticationError } = require('apollo-server');
const JWTVerifier = require('@okta/jwt-verifier');
const okta = require('@okta/okta-sdk-nodejs');
const { Users } = require('../database');

// const basicAuth = Buffer.from([process.env.OKTA_CLIENT_ID, process.env.OKTA_CLIENT_SECRET].join(':')).toString('base64');

const verifier = new JWTVerifier({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    clientId: process.env.OKTA_CLIENT_ID,
});

const client = new okta.Client({
    orgUrl: process.env.OKTA_ORG_URL,
    token: process.env.OKTA_TOKEN,
});

// async function getToken(username, password) {
//     const response = await fetch(`${process.env.OKTA_ORG_URL}/oauth2/default/v1/token`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Basic ${basicAuth}`,
//             Accept: 'application/json',
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//             username,
//             password,
//             grant_type: 'password',
//             scope: 'openid',
//         }).toString(),
//     });
//
//     const { error_description: errorDescription, access_token: accessToken } = await response.json();
//
//     if (errorDescription) {
//         throw new AuthenticationError(errorDescription);
//     }
//
//     return accessToken;
// }

async function getUser(userId) {
    if (!userId) {
        return null;
    }

    try {
        const user = await client.getUser(userId);
        return await Users.getUserByEmail(user.profile.email);
    } catch (error) {
        console.log('in get user \n', error);
    }
}

async function getUserIdFromToken(token) {
    if (!token) {
        return;
    }

    try {
        const jwt = await verifier.verifyAccessToken(token, 'api://default');
        return jwt.claims.sub;
    } catch (error) {
        console.log('in get user id from token \n', error);
    }
}

async function createUser(username, email, password) {
    const userInfo = {
        profile: {
            firstName: username,
            lastName: username,
            login: email,
            email,
        },
        credentials: {
            password: {
                value: password,
            },
        },
    };

    try {
        await client.createUser(userInfo);
    } catch (e) {
        console.error(e);
    }
    return Promise.resolve(true);
}

module.exports = { /* getToken, */ getUserIdFromToken, getUser, createUser };
