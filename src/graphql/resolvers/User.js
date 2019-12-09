const { Projects } = require('../../database');

module.exports = {
    projects: async (par, args, ctx) => await Projects.getProjectsByUserId(ctx.user.userId),
};
