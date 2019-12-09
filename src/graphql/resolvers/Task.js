const { Projects, Columns, Users } = require('../../database');

module.exports = {
    project: async (par, args, ctx) => {
        const { _id } = par;
        const taskId = _id.toString();
        const projectsOfUser = await Projects.getProjectsByUserId(ctx.user.userId);
        return projectsOfUser.find(prj => prj.taskIds.map(tid => tid.toString()).includes(taskId));
    },

    column: async (par, args, ctx) => {
        const { _id } = par;
        const taskId = _id.toString();
        const projectsOfUser = await Projects.getProjectsByUserId(ctx.user.userId);

        let column;
        for (const { columnIds } of projectsOfUser) {
            for (const columnId of columnIds) {
                const col = await Columns.getColumnById(columnId);
                if (col.taskIds.map(tid => tid.toString()).includes(taskId)) {
                    column = col;
                }
            }
        }

        return column;
    },

    assignee: async par => {
        const { assigneeId } = par;
        if (assigneeId) {
            return await Users.getUserById(assigneeId);
        }
        return Promise.resolve();
    },
};
