const { User, Projects } = require('../../database');

const projects = async () => {};

const project = async () => {
    const allProjects = await Projects.getAllProjects();
    return allProjects[0];
};

const tasks = async () => {};

const task = async () => {};

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
