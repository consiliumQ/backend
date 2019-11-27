# backend

Backend System

## Technologies

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Node Driver](https://mongodb.github.io/node-mongodb-native/)
  <!-- - [TypeScript](https://www.typescriptlang.org/) -->
- [GraphQL](https://graphql.org/)
- [Redis](https://redis.io/)

## MongoDB Collections

### Project

#### Data Model

```json
{
    "_id": "ObjectId",
    "name": "string",
    "description": "string",
    "ownerId": "userId",
    "contributorIds": "userId[]",
    "taskIds": "taskId[]",
    "columnIds": "columnId[]"
}
```

#### GraphQL Type

```graphql
type Project {
    _id: Id!
    name: String!
    description: String
    owner: User
    contributers: [User]
    tasks: [Task]!
    columns: [Column]! # order matters
}
```

### Task

#### Data Model

```json
{
    "_id": "ObjectId",
    "title": "string",
    "description": "string",
    "backlog": "{project, release, sprint}",
    "priority": "int",
    "storyPoints": "int",
    "projectId": "projectId",
    "columnId": "columnId",
    "assigneeId": "userId"
}
```

#### GraphQL Type

```graphql
enum Backlog {
    project
    release
    sprint
}

type Task {
    _id: Id!
    title: String!
    description: String
    backlog: Backlog! # when created the task, if not specified, default to `project`
    priority: Int
    storyPoints: Int
    project: Project!
    column: Column! # when first created, put the task in first columns of the project
    assignee: User
}
```

### Column

#### Data Model

```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "projectId": "projectId",
  "tasks": "linked list of taskIds"
}
```

#### GraphQL Type

```graphql
type Column {
    _id: Id!
    name: String!
    description: String
    project: Project!
    tasks: [Task]! (order matters)
}
```

### User

#### Data Model

```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string"
}
```

#### GraphQL Type

```graphql
type User {
    _id: Id!
    username: String
    email: String
    projects: [Project]!
}
```

## GraphQL Queries

```graphql
type Query {
    projects(ownerId: String!): [Project]
    project(projectId: String!): Project
    tasks(projectId: String!, columnId: String, taskId: String): [Task]
    task(taskId: String!): Task
    user(userId: String!): User
}
```

## GraphQL Mutations

```graphql
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
    deleteProject(_id: String!): Project
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
    deleteTask(_id: String!): Task
    addColumn(
        name: String!
        description: String
    ): Column
    updateColumn(
        name: String
        description: String
        tasks: [String]
    ): Column
    deleteColumn(_id: String!): Column
}
```
