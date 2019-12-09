const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getColumnCollectionHandle = getCollectionHandle('columns');
const getTasksCollectionHandle = getCollectionHandle('tasks');

const createColumnObject = ({ name = 'unknown', description = 'unknown', taskIds = [] }) => ({
    name,
    description,
    taskIds,
});

module.exports = {
    getColumnById: async columnId => {
        const columns = await getColumnCollectionHandle();
        return await columns.findOne({ _id: ObjectId(columnId) });
    },

    createOneColumn: async columnInfo => {
        const { _id, name } = columnInfo;
        if (!name) {
            throw '[database/Columns.js] column name is required';
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
            { ...foundColumn, ...updateInfo }, // we may want to wrap this with createColumnObject to filter unexpected fields
            { returnOriginal: false },
        );
        if (!updatedColumn) {
            throw '[database/Columns.js] Updating Column failed';
        }
        return updatedColumn;
    },

    deleteOneColumn: async columnId => {
        if (!columnId) {
            throw '[database/Columns.js] columnId is required';
        }
        const columns = await getColumnCollectionHandle();
        const tasks = await getTasksCollectionHandle();
        const foundColumn = await columns.findOne({ _id: ObjectId(columnId) });
        await foundColumn.taskIds.forEach(async taskId => {
            await tasks.removeOne({ _id: ObjectId(taskId) });
        });
        const deletion = await columns.removeOne({ _id: ObjectId(columnId) });

        if (deletion.deletedCount === 0) {
            throw '[database/Columns.js] Deleting Column failed';
        }

        return foundColumn;
    },
};
