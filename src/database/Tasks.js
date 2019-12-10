const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getProjectCollectionHandle = getCollectionHandle('projects');
const getColumnCollectionHandle = getCollectionHandle('columns');
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
        const { _id, title, projectId, columnId } = taskInfo;
        if (!title) {
            throw '[database/Tasks.js] To create a task a title must be provided!';
        }

        if (!projectId) {
            throw new Error('The projectId is missing for creating an new task.');
        }

        const projects = await getProjectCollectionHandle();
        const columns = await getColumnCollectionHandle();
        const tasks = await getTasksCollectionHandle();

        const newTask = createTaskObject({ ...taskInfo });
        const result = await tasks.insertOne(_id ? { _id, ...newTask } : newTask);

        await projects.findOneAndUpdate({ _id: ObjectId(projectId) }, { $push: { taskIds: result.insertedId } });

        if (columnId) {
            if (await columns.findOne({ _id: ObjectId(columnId) })) {
                await columns.findOneAndUpdate({ _id: ObjectId(columnId) }, { $push: { taskIds: result.insertedId } });
            }
        } else {
            const { columnIds } = await projects.findOne({ _id: ObjectId(projectId) });
            await columns.findOneAndUpdate({ _id: ObjectId(columnIds[0]) }, { $push: { taskIds: result.insertedId } });
        }

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
