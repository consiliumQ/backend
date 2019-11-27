const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getTasksCollectionHandle = getCollectionHandle('tasks');

const createTaskObject = ({
    title = 'unknown',
    description = 'unknown',
    backlog = null,
    priority = null,
    storyPoints = null,
    projectId = null,
    columnId = null,
    assigneeId = null,
}) => ({ title, description, backlog, priority, storyPoints, projectId, columnId, assigneeId });

module.exports = {
    getTaskById: async taskId => {
        if (!taskId) {
            throw 'No taskId is provided';
        }

        const tasks = await getTasksCollectionHandle();
        return await tasks.findOne({ _id: ObjectId(taskId) });
    },

    createOneTask: async taskInfo => {
        const { _id, title } = taskInfo;
        if (!title) {
            throw 'To create a task a title must be provided!';
        }

        const tasks = await getTasksCollectionHandle();

        const newTask = createTaskObject({ ...taskInfo });

        const result = await tasks.insertOne(_id ? { _id, ...newTask } : newTask);
        return await module.exports.getTaskById(result.insertedId);
    },

    updateOneTask: async (taskId, updateInfo = {}) => {
        if (!taskId) {
            throw 'task id is missing';
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
            throw 'Update fail!';
        }

        return udpatedTask;
    },
};
