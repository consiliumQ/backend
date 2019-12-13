const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getUserCollectionHandle = getCollectionHandle('users');

const createUserObject = ({ username = 'unknown', email = 'unknown' }) => ({ username, email });

module.exports = {
    getAllUsers: async () => {
        const users = await getUserCollectionHandle();
        return await users.find({}).toArray();
    },

    getUserByEmail: async email => {
        const users = await getUserCollectionHandle();
        return await users.findOne({ email });
    },

    getUserById: async id => {
        const users = await getUserCollectionHandle();
        return await users.findOne({ _id: ObjectId(id) });
    },

    createOneUser: async userInfo => {
        const { _id, username, email } = userInfo;

        if (!username) {
            throw 'username is not provided';
        }

        if (!email) {
            throw 'email is not provided';
        }

        const users = await getUserCollectionHandle();

        const newUser = createUserObject({ ...userInfo });

        const result = await users.insertOne(_id ? { _id, ...newUser } : newUser);
        return await module.exports.getUserById(result.insertedId);
    },
};
