const { Projects, Tasks } = require('../../database');

module.exports = {
    project: async par => {
        const { projectId } = par;
        return await Projects.getProjectById(projectId);
    },

    tasks: async par => {
        const { taskIds } = par;
        return taskIds.map(async tid => await Tasks.getTaskById(tid));
    },
};
