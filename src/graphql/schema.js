const { gql } = require('apollo-server');

const typeDefs = gql`
    enum Backlog {
        project
        release
        sprint
    }

    type User {
        _id: ID!
        username: String
        email: String
        projects: [Project]!
    }

    type Project {
        _id: ID!
        name: String!
        description: String
        owner: User
        contributers: [User]
        tasks: [Task]!
        columns: [Column]! # order matters
    }

    type Column {
        _id: ID!
        name: String!
        description: String
        project: Project!
        tasks: [Task]!
    }

    type Task {
        _id: ID!
        title: String!
        description: String
        backlog: Backlog! # when created the task, if not specified, default to "project"
        priority: Int
        storyPoints: Int
        project: Project!
        column: Column! # when first created, put the task in first columns of the project
        assignee: User
    }

    type Query {
        projects(ownerId: ID!): [Project]
        project(projectId: ID): Project
        # tasks(projectId: ID!, columnId: ID, taskId: ID): [Task]
        column(columnId: ID): Column
        task(taskId: ID!): Task
        user: User
    }

    input UpdateProject {
        name: String
        description: String
        constributorIds: [ID!]
        taskIds: [ID!]
        columnIds: [ID!]
    }

    input UpdateColumn {
        columnId: ID
        name: String
        description: String
        taskIds: [ID!]
    }

    input UpdateTask {
        title: String
        description: String
        backlog: Backlog
        priority: Int
        storyPoints: Int
        assigneeId: ID
    }

    input UpdateUser {
        username: String
        email: String
        projects: [ID!]
    }

    type Mutation {
        # Project
        addProject(name: String!, ownerId: ID!, description: String): Project
        updateProject(projectId: ID!, updateProjectObj: UpdateProject): Project
        deleteProject(projectId: ID!): Project
        # Task
        addTask(title: String!, description: String, projectId: ID!, columnId: ID): Task
        updateTask(taskId: ID!, updateTaskObj: UpdateTask): Task
        deleteTask(taskId: ID!): Task
        # Column
        addColumn(name: String!, projectId: ID!, description: String): Column # Project # I thought return a Project type can auto update cache in the frontend, not really
        updateColumn(updateColumnArray: [UpdateColumn]): [Column]
        updateOneColumn(columnId: ID!, updateColumnObj: UpdateColumn): Column
        deleteColumn(columnId: ID!): Column
    }
`;

module.exports = typeDefs;
