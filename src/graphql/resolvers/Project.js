const { Tasks, Columns, Users } = require('../../database');

module.exports = {
    owner: async par => {
        const { ownerId } = par;
        return await Users.getUserById(ownerId);
    },

    contributers: async par => {
        const { contributerIds } = par;
        return contributerIds.map(async uid => await Users.getUserById(uid));
    },

    tasks: async par => {
        const { taskIds } = par;
        return taskIds.map(async tid => await Tasks.getTaskById(tid));
    },

    columns: async par => {
        const { columnIds } = par;
        return columnIds.map(async cid => await Columns.getColumnById(cid));
    },
};
