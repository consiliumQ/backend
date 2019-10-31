# backend
Backend System

## Technologies
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Node Driver](https://mongodb.github.io/node-mongodb-native/)
- [TypeScript](https://www.typescriptlang.org/)

## Collections
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
### Project
```json
{
  "id": "string/ObjectID",
  "username": "string",
  "email": "string"
}
```