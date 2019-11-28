const { Projects, Columns, Users } = require('../../database');

module.exports = {
    project: async par => {
        const { projectId } = par;
        return await Projects.getProjectById(projectId);
    },

    column: async par => {
        const { columnId } = par;
        return await Columns.getColumnById(columnId);
    },

    assignee: async par => {
        const { assigneeId } = par;
        if (assigneeId) {
            return await Users.getUserById(assigneeId);
        }
        return Promise.resolve();
    },
};
