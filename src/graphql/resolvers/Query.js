const { Users, Projects, Tasks } = require('../../database');

// arg -> ownerId?
const projects = async (par, args, ctx) => {
    return await Projects.getProjectsByUserId(ctx.user.userId);
};

const project = async (_, args, ctx) => {
    const { projectId } = args;

    let targetProject;
    if (ctx.user) {
        if (projectId) {
            targetProject = await Projects.getProjectById(projectId);
        } else {
            [targetProject] = await Projects.getProjectsByUserId(ctx.user.userId);
        }
    } else {
        throw new Error('Usre not logged in!');
    }

    return targetProject;
};

// args: projectId, columnId, taskId
// I don't think we really need this
// const tasks = async (_, args) => {};

const task = async (_, args) => {
    const foundTask = await Tasks.getTaskById(args.taskId);
    return foundTask;
};

const user = async (_, args, ctx) => {
    const foundUser = await Users.getUserById(ctx.user.userId);
    return foundUser;
};

module.exports = {
    projects,
    project,
    // tasks,
    task,
    user,
};
