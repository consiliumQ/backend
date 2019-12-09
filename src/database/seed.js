const { ObjectId } = require('mongodb');
const { mongoConnect } = require('./config');
const Users = require('./Users');
const Projects = require('./Projects');
const Columns = require('./Columns');
const Tasks = require('./Tasks');

const getProjectIds = (numOfPrj = 4) => Array.from(Array(numOfPrj).keys()).map(() => ObjectId());
const getColumnIds = (numOfCol = 3) => Array.from(Array(numOfCol).keys()).map(() => ObjectId());
const getTaskIds = (numOfTsk = 8) => Array.from(Array(numOfTsk).keys()).map(() => ObjectId());
const getUserIds = (numOfUsr = 3) => Array.from(Array(numOfUsr).keys()).map(() => ObjectId());

module.exports = async () => {
    const db = await mongoConnect();
    db.dropDatabase();

    const ownerId = ObjectId('5ded787d0ea584c3dd89ddc0'); // manually generated dummy userId
    const userIds = [ownerId, ...getUserIds(4)];

    for (const userId of userIds) {
        const userInfo = {
            _id: userId,
            username: `TestUser_${userId.toString().slice(-4)}`,
            email: `test.user${userId.toString().slice(-4)}@consiliumq.com`,
        };

        await Users.createOneUser(userInfo);

        const projectIds = getProjectIds();
        for (const projectId of projectIds) {
            const columnIds = getColumnIds();
            const taskIds = getTaskIds();

            const projectInfo = {
                _id: projectId,
                name: `TestProject_${projectId.toString().slice(-4)}`,
                description: 'This is a project created by default (for development majorly.',
                ownerId: userId,
                columnIds,
                taskIds,
            };

            const columnsInfo = columnIds.map((cid, idx) => ({
                _id: cid,
                name: `Dummy Col No.${cid.toString().slice(-4)}_${idx}`,
                description: `This is dummy col No.${cid.toString().slice(-4)}_${idx}`,
                taskIds: taskIds.filter((_, tidx) => tidx % columnIds.length === idx),
            }));

            const tasksInfo = taskIds.map((tid, idx) => ({
                _id: tid,
                title: `Dummy Task No.${idx}`,
                description: `This is dummy task No.${idx}`,
            }));

            await Projects.createOneProject(projectInfo);

            for (const taskInfo of tasksInfo) {
                await Tasks.createOneTask(taskInfo);
            }

            for (const colInfo of columnsInfo) {
                await Columns.createOneColumn(colInfo);
            }
        }
    }

    await db.serverConfig.close();
};
