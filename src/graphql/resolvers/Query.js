const { User, Projects, Tasks } = require('../../database');

// arg -> ownerId?
const projects = async () => {
    const allProjects = await Projects.getAllProjects();
    return allProjects[0];
};

const project = async (_, args) => {
    const foundProject = await Projects.getProjectById(args.projectId);
    return foundProject;
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
