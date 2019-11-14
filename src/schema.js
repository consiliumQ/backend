const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    projects: [Project]
  }

  type Project {
    id: ID!
    name: String!
    description: String
    owner: User!
    constributors: User
    tasks: [Task]
    columns: [Column]
  }

  type Column {
    id: ID!
    name: String!
    description: String
    project: Project!
    tasks: [Task]!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    # backlog: {project, release, sprint}
    backlog: String!
    priority: Int
    storyPoints: Int
    column: Column!
    assignee: User
  }

  type Query {
    projects(ownerId: String!): [Project]
    project(projectId: String!): Project
    tasks(projectId: String!, columnId: String, taskId: String): [Task]
    task(taskId: String!): Task
    user(userId: String!): User
  }

  type Mutation {
    # Project
    addProject(name: String!, owner: String!, description: String): Project
    updateProject(
      name: String
      description: String
      constributors: [String]
      columns: [String]
      tasks: [String]
    ): Project
    deleteProject(id: String!): Project
    # Task
    addTask(title: String!, description: String): Task
    updateTask(
      title: String
      description: String
      backlog: String
      priority: Int
      storyPoints: Int
      status: String
      assignee: String
    ): Task
    deleteTask(id: String!): Task
    # Column
    addColumn(name: String!, description: String): Column
    updateColumn(name: String, description: String, tasks: [String]): Column
    deleteColumn(id: String!): Column
  }
`;

module.exports = { typeDefs };
