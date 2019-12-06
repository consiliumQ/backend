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

    updateOneColumn: async (columnId, updateInfo) => {
        if (!columnId) {
            throw '[database/Columns.js] columnId is required';
        }
        const columns = await getColumnCollectionHandle();
        const foundColumn = await columns.findOne({ _id: ObjectId(columnId) });
        const { value: updatedColumn } = await columns.findOneAndReplace(
            { _id: ObjectId(columnId) },
            { ...foundColumn, ...updateInfo },
            { returnOriginal: false },
        );
        if (!updatedColumn) {
            throw '[database/Columns.js] Updating Column failed';
        }
        return updatedColumn;
    },

    deleteOneColumn: async columnId => {
        if (!columnid) {
            throw '[database/Columns.js] columnId is required';
        }
        const columns = await getColumnCollectionHandle();
        const foundColumn = await columns.findOne({ _id: ObjectId(columnId) });
        const deletion = await columns.removeOne({ _id: ObjectId(columnId) });

        if (deletion.deletedCount === 0) {
            throw '[database/Columns.js] Deleting Column failed';
        }

        return foundColumn;
    },
};
