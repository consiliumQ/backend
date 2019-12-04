const { ObjectId } = require('mongodb');
const { mongoConnect } = require('./config');
const Users = require('./Users');
const Projects = require('./Projects');
const Columns = require('./Columns');
const Tasks = require('./Tasks');

module.exports = async () => {
    const db = await mongoConnect();
    db.dropDatabase();

    const ownerId = ObjectId();
    const projectId = ObjectId();
    const columnIds = Array.from(Array(3).keys()).map(() => ObjectId());
    const taskIds = Array.from(Array(8).keys()).map(() => ObjectId());

    const userInfo = {
        _id: ownerId,
        username: 'TestUser',
        email: 'test.user@consiliumq.com',
    };

    const projectInfo = {
        _id: projectId,
        name: 'TestProject',
        description: 'This is a project created by default (for development majorly.',
        ownerId,
        columnIds,
        taskIds,
    };

    const columnsInfo = columnIds.map((cid, idx) => ({
        _id: cid,
        name: `Dummy Col No.0x0${idx}`,
        description: `This is dummy col No.0x0${idx}`,
        projectId,
        taskIds: taskIds.filter((_, tidx) => tidx % 3 === idx),
    }));

    const tasksInfo = taskIds.map((tid, idx) => ({
        _id: tid,
        title: `Dummy Task No.${idx}`,
        description: `This is dummy task No.${idx}`,
        projectId,
        columnId: columnIds[idx % 3],
    }));

    await Users.createOneUser(userInfo);

    await Projects.createOneProject(projectInfo);

    for (const taskInfo of tasksInfo) {
        await Tasks.createOneTask(taskInfo);
    }

    for (const colInfo of columnsInfo) {
        await Columns.createOneColumn(colInfo);
    }

    await db.serverConfig.close();
};
