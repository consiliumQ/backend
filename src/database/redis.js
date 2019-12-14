const bluebird = require('bluebird');
const redis = require('redis');

const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const PROJECT_CACHE_KEY = 'project';

const addProject = async obj => {
    await client.hsetAsync(PROJECT_CACHE_KEY, obj._id, JSON.stringify(obj));
    const addedProject = await client.hgetAsync(PROJECT_CACHE_KEY, obj._id);
    return JSON.parse(addedProject);
};

const getAllProjectsByOwnerId = async ownerId => {
    const allProjects = await client.hgetallAsync(PROJECT_CACHE_KEY);
    let projectsByOwnerId = [];
    allProjectArr = Object.values(allProjects).map(p => JSON.parse(p));
    allProjectArr.forEach(element => {
        if (element.ownerId === ownerId) {
            projectsByOwnerId.push(element);
        }
    });
    return projectsByOwnerId;
};

module.exports = {
    addProject,
    getAllProjectsByOwnerId,
};
