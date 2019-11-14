# backend
Backend System

## Technologies
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Node Driver](https://mongodb.github.io/node-mongodb-native/)
- [TypeScript](https://www.typescriptlang.org/)
- [GraphQL](https://graphql.org/)

## MongoDB Collections
### Project
```json
{
  "id": "string/ObjectID",
  "name": "string",
  "description": "string",
  "owner": "userId",
  "contributors": "userId[]",
  "tasks": "taskId[]",
  "columns": "columnId[]"
}
```
### Task
```json
{
  "id": "string/ObjectID",
  "title": "string",
  "description": "string",
  "backlog": "{project, release, sprint}",
  "priority": "int",
  "storyPoints": "int",
  "status": "columnId",
  "assignee": "userId"
}
```
### Column
```json
{
  "id": "string/ObjectID",
  "name": "string",
  "description": "string",
  "tasks": "linked list of taskIds"
}
```
### User
```json
{
  "id": "string/ObjectID",
  "username": "string",
  "email": "string"
}
```

## GraphQL Types
### User
```js
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
    type User {
        id: Id!
        projects: [Project]!
    }
`;
```
### Projects
```js
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
    type Project {
        id: Id!
        tasks: [Task]!
        columns: [Column]! (order matters)
        owner: User (logged in user)
        contributers: [User]
    }
`;
```
### Column
```js
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
    type Column {
        id: Id!
        project: Project!
        tasks: [Task]! (order matters)
    }
`;
```
### Task
```js
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
    type Task {
        id: Id!
        project: Project!
        column: Column!
        assignee: User
    }
`;
```

## GraphQL Queries
```js
const { ApolloServer, gql } = require("apollo-server");

// Authentication will pass the logged in User as ownerId and userId
const typeDefs = gql`
    type Query {
        projects(ownerId: String!): [Project]
        project(projectId: String!): Project
        tasks(projectId: String!, columnId: String, taskId: String): [Task]
        task(taskId: String!): Task
        user(userId: String!): User
    }
`;
```

## GraphQL Mutations
```js
const { ApolloServer, gql } = require("apollo-server");

/*
 updateProject will use an object called updatedProjectData that stores the below optional keys
 updateTask will use an object called updatedTaskData that stores the below optional keys
 updateColumn will use an object called updatedColumnData that stores the below optional keys
*/
const typeDefs = gql`
    type Mutation {
        addProject(
            name: String!
            owner: String!
            description: String
        ): Project
        updateProject(
            name: String
            description: String
            contributors: [String]
            columns: [String]
            tasks: [String]
        ): Project
        deleteProject(id: String!): Project
        addTask(
            title: String!
            description: String
        ): Task
        updateTask(
            title: String
            description: String
            backlog: String -> {project, release, sprint}
            priority: Int
            storyPoints: Int
            status: String
            assignee: String
        ): Task
        deleteTask(id: String!): Task
        addColumn(
            name: String!
            description: String
        ): Column
        updateColumn(
            name: String
            description: String
            tasks: [String]
        ): Column
        deleteColumn(id: String!): Column
    }
`;
```