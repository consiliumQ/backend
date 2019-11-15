const { User } = require('../../database');

const projects = async (parent, args) => {};

const project = async (parent, args) => {};

const tasks = async (parent, args) => {};

const task = async (parent, args) => {};

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
