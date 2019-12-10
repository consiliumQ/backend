const { Projects, Tasks, Columns } = require('../../database');

const addProject = async (_, args) => {
    if (!args.name || !args.ownerId) {
        throw `[graphql/resolvers/Mutation.js] name and ownerId are required in order to add new project`;
    }

    if (args.name.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for project name`;
    }

    if (args.ownerId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for name for new project`;
    }

    if (args.description) {
        if (args.description.constructor !== String) {
            throw `[graphql/resolvers/Mutation.js] Invalid input for project description`;
        }
    }
    const addedProject = await Projects.createOneProject(args);
    return addedProject;
};
const updateProject = async (_, args) => {
    if (!args.projectId) {
        throw `[graphql/resolvers/Mutation.js] projectId is required in order to update a project`;
    }

    if (args.projectId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input for projectId`;
    }

    // type check for updateProjectObj

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

    const addedTask = await Tasks.createOneTask(args);
    return addedTask;
};
const updateTask = async (_, args) => {
    if (!args.taskId) {
        throw `[graphql/resolvers/Mutation.js] taskId is required in order to update a task`;
    }

    if (args.taskId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for taskId`;
    }

    const updatedTask = await Tasks.updateOneTask(args.taskId, args.updateTaskObj);
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

    const addedColumn = await Columns.createOneColumn(args);
    // const modifiedProject = await Projects.getProjectByColumnId(newColumnId);
    // return modifiedProject;
    return addedColumn;
};
const updateColumn = async (_, args) => {
    if (!args.columnId) {
        throw `[graphql/resolvers/Mutation.js] columnId is required in order to update a column`;
    }

    const updatedColumn = await Columns.updateOneColumn(args.columnId, args.updateColumnObj);
    return updatedColumn;
};
const deleteColumn = async (_, args) => {
    if (!args.columnId) {
        throw `[graphql/resolvers/Mutation.js] columnId is required in order to delete a column`;
    }

    if (args.columnId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for columnId`;
    }

    const deletedColumn = await Columns.deleteOneColumn(args.columnId);
    return deletedColumn;
};

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
