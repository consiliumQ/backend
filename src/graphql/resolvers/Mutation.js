const { Projects, Tasks, Columns, dummyUser } = require('../../database');
const cacheData = require('../../database/redis');
const uuid = require('node-uuid');
const { AuthenticationError } = require('apollo-server');
const { createUser } = require('../../authentication/auth')

const addProject = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
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

const addToken = async (_, args) => {
    if (!args.accessToken) {
        throw `[graphql/resolvers/Mutation.js] accessToken is required`;
    }

    if (args.accessToken.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type`;
    }

    let tokenObj = {
        accessToken: args.accessToken
    }

    try {
        const addedToken = await cacheData.addNewToken(tokenObj);
        return addedToken;
    } catch(e) {
        console.log(e);
    }

}

const addProjectToCache = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
    if (!args.name || !args.ownerId) {
        throw `[graphql/resolvers/Mutation.js] name and ownerId are required in order to add new project`;
    }

    if (args.name.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for project name`;
    }

    if (args.ownerId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for name for new project`;
    }

    let newProject = {
        _id: uuid.v4(),
        name: args.name,
        ownerId: args.ownerId,
        description: args.description
    };

    try {
        const addedProject = await cacheData.addProject(newProject);
        return addedProject;
    } catch (e) {
        console.log(e);
    }
};
const updateProject = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
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
const deleteProject = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
    if (!args.projectId) {
        throw `[graphql/resolvers/Mutation.js] projectId is required in order to delete a project`;
    }

    if (args.projectId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for projectId`;
    }

    const deletedProject = await Projects.deleteOneProject(args.projectId);

    return deletedProject;
};
const addTask = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
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
const updateTask = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
    if (!args.taskId) {
        throw `[graphql/resolvers/Mutation.js] taskId is required in order to update a task`;
    }

    if (args.taskId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for taskId`;
    }

    const updatedTask = await Tasks.updateOneTask(args.taskId, args.updateTaskObj);
    return updatedTask;
};
const deleteTask = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
    if (!args.taskId) {
        throw `[graphql/resolvers/Mutation.js] taskId is required in order to delete a task`;
    }

    if (args.taskId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for taskId`;
    }

    const deletedTask = await Tasks.deleteOneTask(args.taskId);
    return deletedTask;
};
const addColumn = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
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
const updateColumn = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');

    const { updateColumnArray } = args;

    const updatedColumns = updateColumnArray.map(async updateCol => {
        const { columnId, ...updateColumnObj } = updateCol;
        if (!columnId) {
            throw `[graphql/resolvers/Mutation.js] columnId is required in order to update a column`;
        }

        return await Columns.updateOneColumn(columnId, updateColumnObj);
    });

    return updatedColumns;
};

const updateOneColumn = async (_, args, context) => {
    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
    if (!args.columnId) {
        throw `[graphql/resolvers/Mutation.js] columnId is required in order to update a column`;
    }

    if (args.columnId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for columnId`;
    }

    const updatedColumn = await Columns.updateOneColumn(args.columnId, args.updateColumnObj);
    return updatedColumn;
};

const deleteColumn = async (_, args, context) => {

    if (context.user === dummyUser) throw new AuthenticationError('You must be logged in to perform this action');
    if (!args.columnId) {
        throw `[graphql/resolvers/Mutation.js] columnId is required in order to delete a column`;
    }

    if (args.columnId.constructor !== String) {
        throw `[graphql/resolvers/Mutation.js] Invalid input type for columnId`;
    }

    const deletedColumn = await Columns.deleteOneColumn(args.columnId);
    return deletedColumn;
};

const signup = async (_, args) => {
    const { username, email, password } = args;
    try {
        await createUser(username, email, password);
    } catch (e) {
        console.error(e);
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
};


module.exports = {
    addProject,
    addProjectToCache,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addColumn,
    updateColumn,
    updateOneColumn,
    deleteColumn,
    signup,
    addToken
};
