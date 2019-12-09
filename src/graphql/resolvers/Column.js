const { Projects, Tasks } = require('../../database');

module.exports = {
    project: async (par, args, ctx) => {
        const { _id } = par;
        const columnId = _id.toString();
        const projectsOfUser = await Projects.getProjectsByUserId(ctx.user.userId);
        return projectsOfUser.find(prj => prj.columnIds.map(cid => cid.toString()).includes(columnId));
    },

    tasks: async par => {
        const { taskIds } = par;
        return taskIds.map(async tid => await Tasks.getTaskById(tid));
    },
};
