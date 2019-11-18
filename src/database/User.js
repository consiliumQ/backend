const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getUserCollectionHandle = getCollectionHandle('user');

module.exports = {
    getAllUsers: async () => {
        const user = await getUserCollectionHandle();
        return await user.find({}).toArray();
    },

    getUserById: async id => {
        const user = await getUserCollectionHandle();
        return await user.findOne({ _id: ObjectId(id) });
    },

    createOneUser: async userInfo => {
        const user = await getUserCollectionHandle();

        const result = await user.insertOne(userInfo);
        return await module.exports.getUserById(result.insertedId);
    },
};
