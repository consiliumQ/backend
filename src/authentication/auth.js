const fetch = require('node-fetch');
const { AuthenticationError } = require('apollo-server');
const JWTVerifier = require('@okta/jwt-verifier');
const okta = require('@okta/okta-sdk-nodejs');

const basicAuth = Buffer.from([process.env.OKTA_CLIENT_ID, process.env.OKTA_CLIENT_SECRET].join(':')).toString('base64');

const verifier = new JWTVerifier({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    clientId: process.env.OKTA_CLIENT_ID,
});

const client = new okta.Client({
    orgUrl: process.env.OKTA_ORG_URL,
    token: process.env.OKTA_TOKEN,
});

async function getToken(username, password) {
    const response = await fetch(`${process.env.OKTA_ORG_URL}/oauth2/default/v1/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username,
            password,
            grant_type: 'password',
            scope: 'openid',
        }).toString(),
    });

    const { error_description, access_token } = await response.json();

    if (error_description) throw new AuthenticationError(error_description);

    return access_token;
}

async function getUser(userId) {
    if (!userId) return;

    try {
        const user = await client.getUser(userId);
        return user.profile;
    } catch (error) {
        // ignore
    }
}

async function getUserIdFromToken(token) {
    if (!token) return;

    try {
        const jwt = await verifier.verifyAccessToken(token);
        return jwt.claims.sub;
    } catch (error) {
        // ignore
    }
}

module.exports = { getToken, getUserIdFromToken, getUser };
