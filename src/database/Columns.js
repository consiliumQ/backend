const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getColumnCollectionHandle = getCollectionHandle('columns');

const createColumnObject = ({ name = 'unknown', description = 'unknown', projectId = null, taskIds = [] }) => ({
    name,
    description,
    projectId,
    taskIds,
});

module.exports = {
    getColumnById: async columnId => {
        const columns = await getColumnCollectionHandle();
        return await columns.findOne({ _id: ObjectId(columnId) });
    },

    createOneColumn: async columnInfo => {
        const { _id, name, projectId } = columnInfo;
        if (!name) {
            throw 'The name field is required but is missing!';
        }

        if (!projectId) {
            throw 'The project ID is missing.';
        }

        const columns = await getColumnCollectionHandle();

        const newColumn = createColumnObject({ ...columnInfo });

        const result = await columns.insertOne(_id ? { _id, ...newColumn } : newColumn);
        return await module.exports.getColumnById(result.insertedId);
    },
};
