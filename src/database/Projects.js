const { ObjectId } = require('mongodb');
const { getCollectionHandle } = require('./config');

const getProjectCollectionHanlde = getCollectionHandle('projects');

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

    getAllProjects: async () => {
        const project = await getProjectCollectionHanlde();
        return await project.find({}).toArray();
    },

    createOneProject: async projectInfo => {
        const { _id, name, ownerId } = projectInfo;
        if (!name || !ownerId) {
            throw 'Name and owner fields are required but missing!';
        }

        const project = await getProjectCollectionHanlde();

        const newProject = createProjectObject({ ...projectInfo });

        const result = await project.insertOne(_id ? { _id, ...newProject } : newProject);
        return await module.exports.getProjectById(result.insertedId);
    },

    // updateOneProject: async (projectId, updateInfo) => {},
};
