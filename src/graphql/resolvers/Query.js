const { User, Projects, Tasks } = require('../../database');

// arg -> ownerId?
const projects = async () => {
    // probably wait till the authentication done to implement this method, or use a dummy/seeded data to pretend a logged in status.
};

const project = async (_, args) => {
    // NOTE: the code commented out is the proper code for this resolver
    //       the code uncommented is the work around to coorperate frontend dev

    // const foundProject = await Projects.getProjectById(args.projectId);
    // return foundProject;
    const allProjects = await Projects.getAllProjects();
    return allProjects[0];
};

// args: projectId, columnId, taskId
const tasks = async (_, args) => {};

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
    tasks,
    task,
    user,
};
