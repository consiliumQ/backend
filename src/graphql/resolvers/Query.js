const { User, Projects, Tasks } = require('../../database');

// arg -> ownerId?
const projects = async (par, args, ctx) => {
    return await Projects.getProjectsByUserId(ctx.user.userId);
};

const project = async (_, args, ctx) => {
    // NOTE: the code commented out is the proper code for this resolver
    //       the code uncommented is the work around to coorperate frontend dev

    const projectsByUserId = await Projects.getProjectsByUserId(ctx.user.userId);
    return projectsByUserId[0];
};

// args: projectId, columnId, taskId
// I don't think we really need this
// const tasks = async (_, args) => {};

const task = async (_, args) => {
    const foundTask = await Tasks.getTaskById(args.taskId);
    return foundTask;
};

const user = async (_, args) => {
    const foundUser = await User.getUserById(args.userId);
    return foundUser;
};

module.exports = {
    projects,
    project,
    // tasks,
    task,
    user,
};
