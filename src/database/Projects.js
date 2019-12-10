const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getProjectCollectionHanlde = getCollectionHandle('projects');
const getColumnCollectionHandle = getCollectionHandle('columns');
const getTasksCollectionHandle = getCollectionHandle('tasks');

const createProjectObject = ({ name = 'unknown', ownerId = null, description = 'unknown', contributorIds = [], taskIds = [], columnIds = [] }) => ({
    name,
    ownerId,
    description,
    contributorIds,
    taskIds,
    columnIds,
});

module.exports = {
    getProjectById: async projectId => {
        const project = await getProjectCollectionHanlde();
        return await project.findOne({ _id: ObjectId(projectId) });
    },

    getProjectByColumnId: async columnId => {
        const project = await getProjectCollectionHanlde();
        return await project.findOne({ columnIds: { $elemMatch: { $eq: ObjectId(columnId) } } });
    },

    getProjectsByUserId: async userId => {
        const project = await getProjectCollectionHanlde();
        return await project.find({ ownerId: ObjectId(userId) }).toArray();
    },

    getAllProjects: async () => {
        const project = await getProjectCollectionHanlde();
        return await project.find({}).toArray();
    },

    createOneProject: async projectInfo => {
        const { _id, name, ownerId } = projectInfo;
        if (!name || !ownerId) {
            throw '[database/Projects.js] Name and owner fields are required but missing!';
        }
        const project = await getProjectCollectionHanlde();
        const newProject = createProjectObject({ ...projectInfo });
        const result = await project.insertOne(_id ? { _id, ...newProject } : newProject);
        return await module.exports.getProjectById(result.insertedId);
    },

    updateOneProject: async (projectId, updateInfo) => {
        if (!projectId) {
            throw '[database/Projects.js] projectId is required';
        }
        const project = await getProjectCollectionHanlde();
        const foundProject = await project.findOne({ _id: ObjectId(projectId) });
        const { value: updatedProject } = await project.findOneAndReplace(
            { _id: ObjectId(projectId) },
            { ...foundProject, ...updateInfo },
            { returnOriginal: false },
        );
        if (!updatedProject) {
            throw '[database/Projects.js] Updating Project failed';
        }
        return updatedProject;
    },

    deleteOneProject: async projectId => {
        if (!projectId) {
            throw '[database/Projects.js] projectId is required';
        }
        const project = await getProjectCollectionHanlde();
        const columns = await getColumnCollectionHandle();
        const tasks = await getTasksCollectionHandle();
        const foundProject = await project.findOne({ _id: ObjectId(projectId) });

        await foundProject.columnIds.forEach(async columnId => {
            await columns.removeOne({ _id: ObjectId(columnId) });
        });

        await foundProject.taskIds.forEach(async taskId => {
            await tasks.removeOne({ _id: ObjectId(taskId) });
        });

        const deletion = await project.removeOne({ _id: ObjectId(projectId) });

        if (deletion.deletedCount === 0) {
            throw '[database/Projects.js] Deleting Project failed';
        }

        return foundProject;
    },
};
