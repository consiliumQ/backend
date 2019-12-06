const { Projects, Tasks } = require('../../database');

const addProject = async (_, args) => {
    if (!args.name || !args.ownerId) {
        throw `[graphql/resolvers/Mutation.js] name and ownerId are required in order to add new project`;
    }

    if (args.name.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for project name`;
    }

    if (args.ownerId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for namefor new project`;
    }

    if (args.description) {
        if (args.description.constructor !== String) {
            throw `[graphql/resolvers/Mutation.js] Invalid input for project description`;
        }
    }

    const projectInfo = { name: args.name, ownerId: args.ownerId };
    const addedProject = await Projects.createOneProject(projectInfo);

    return addedProject;
};
const updateProject = async (_, args) => {
    if (!args.projectId) {
        throw `[graphql/resolvers/Mutation.js] projectId is required in order to update a project`;
    }

    //type check for args.updateProjectObj

    const updatedProject = await Projects.updateOneProject(args.projectId, args.updateProjectObj);
    return updatedProject;
};
const deleteProject = async (_, args) => {
    if (!args.projectId) {
        throw `[graphql/resolvers/Mutation.js] projectId is required in order to delete a project`;
    }

    if (args.projectId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for projectId`;
    }

    const deletedProject = await Projects.deleteOneProject(args.projectId);
    return deletedProject;
};
const addTask = async (_, args) => {
    if (!args.title) {
        throw `[graphql/resolvers/Mutation.js] title is required in order to add new task`;
    }

    if (args.title.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for task title`;
    }

    if (args.description) {
        if (args.description.constructor !== String) {
            throw `[graphql/resolvers/Mutation.js] Invalid input type for task description`;
        }
    }

    const taskInfo = { title: args.title };
    const addedTask = await Tasks.createOneTask(taskInfo);

    return addedTask;
};
const updateTask = async (_, args) => {
    if (!args.projectId) {
        throw `[graphql/resolvers/Mutation.js] projectId is required in order to update a task`;
    }

    // type check for args.updateTaskObj

    const updatedTask = await Tasks.updateOneTask(args.projectId, args.updatedTaskObj);
    return updatedTask;
};
const deleteTask = async (_, args) => {
    if (!args.taskId) {
        throw `[graphql/resolvers/Mutation.js] taskId is required in order to delete a task`;
    }

    if (args.taskId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for taskId`;
    }

    const deletedTask = await Tasks.deleteOneTask(args.taskId);
    return deletedTask;
};
const addColumn = async (_, args) => {
    if (!args.name || !args.projectId) {
        throw `[graphql/resolvers/Mutation.js] name is required in order to add new Column`;
    }

    if (args.name.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for column name`;
    }

    if (args.projectId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for projectId`;
    }

    if (args.description) {
        if (args.description.constructor !== String) {
            throw `[graphql/resolvers/Mutation.js] Invalid input type for column description`;
        }
    }
};
const updateColumn = async () => {};
const deleteColumn = async () => {};

module.exports = {
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addColumn,
    updateColumn,
    deleteColumn,
};
