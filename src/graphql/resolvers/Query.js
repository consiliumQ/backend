const { Users, Projects, Tasks, Columns } = require('../../database');
const cacheData = require('../../database/redis');

const projects = async (par, args, ctx) => {
    return await Projects.getProjectsByUserId(ctx.user.userId);
};

const projectsFromCache = async (_, args) => {
    try {
        const allProject = await cacheData.getAllProjectsByOwnerId(args.ownerId);
        return allProject;
    } catch (e) {
        console.log(e);
    }
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

const column = async (_, args) => {
    const foundColumn = await Columns.getColumnById(args.columnId);
    return foundColumn;
};
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
    projectsFromCache,
    project,
    column,
    task,
    user,
};
