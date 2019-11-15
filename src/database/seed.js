const { mongoConnect } = require('./config');
const userDbOperation = require('./User');

module.exports = async () => {
    const db = await mongoConnect();
    db.dropDatabase();

    const userInfo = {
        username: 'TestUser',
        email: 'test.user@consiliumq.com',
    };

    await userDbOperation.createOneUser(userInfo);

    await db.serverConfig.close();
};
