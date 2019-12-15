const { Projects } = require('../../database');

module.exports = {
    projects: async (par, args, context) => await Projects.getProjectsByUserId(context.user.userId),
};
