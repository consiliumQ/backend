const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getTasksCollectionHandle = getCollectionHandle('tasks');

const createTaskObject = ({
    title = 'unknown',
    description = 'unknown',
    backlog = null,
    priority = null,
    storyPoints = null,
    assigneeId = null,
}) => ({ title, description, backlog, priority, storyPoints, assigneeId });

module.exports = {
    getTaskById: async taskId => {
        if (!taskId) {
            throw '[database/Tasks.js] No taskId is provided';
        }

        const tasks = await getTasksCollectionHandle();
        return await tasks.findOne({ _id: ObjectId(taskId) });
    },

    createOneTask: async taskInfo => {
        const { _id, title } = taskInfo;
        if (!title) {
            throw '[database/Tasks.js] To create a task a title must be provided!';
        }

        const tasks = await getTasksCollectionHandle();

        const newTask = createTaskObject({ ...taskInfo });

        const result = await tasks.insertOne(_id ? { _id, ...newTask } : newTask);
        return await module.exports.getTaskById(result.insertedId);
    },

    updateOneTask: async (taskId, updateInfo = {}) => {
        if (!taskId) {
            throw '[database/Tasks.js] taskId is required';
        }

        // it's probably good to check the keys in updateInfo against the schema from createTaskObject
        const tasks = await getTasksCollectionHandle();
        const foundTask = await tasks.findOne({ _id: ObjectId(taskId) });
        const { value: udpatedTask } = await tasks.findOneAndReplace(
            { _id: ObjectId(taskId) },
            { ...foundTask, ...updateInfo },
            { returnOriginal: false },
        );

        if (!udpatedTask) {
            throw '[database/Tasks.js] Updating Task failed';
        }

        return udpatedTask;
    },

    deleteOneTask: async taskId => {
        if (!taskId) {
            throw '[database/Tasks.js] taskId is required';
        }
        const tasks = await getTasksCollectionHandle();
        const foundTask = await tasks.findOne({ _id: ObjectId(taskId) });
        const deletion = await tasks.removeOne({ _id: ObjectId(taskId) });

        if (deletion.deletedCount === 0) {
            throw '[database/Tasks.js] Deleting Task failed';
        }

        return foundTask;
    },
};
