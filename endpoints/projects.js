// Function to interact whith projects
// GetAll, CreateProject, GetProject, UpdateProject, DeleteProject

import documentClient from "../database/connect.js"
import { DeleteCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { v4 as uuidV4 } from "uuid"

export const getAllProjects = async (req, res) => {
  // Retreive projects
  const projects = await documentClient.send(new ScanCommand({
    TableName: 'projects'
  }))
  // Return projects
  return res.json({ projects: projects.Items })
}

export const createProject = async (req, res) => {
  // Create project
  const project = { project_id: uuidV4(), ...req.body }
  await documentClient.send(new PutCommand({
    TableName: 'projects',
    Item: project
  }))
  // Return project
  return res.json({ message: 'Project created', project })
}

export const getProject = async (req, res) => {
  const { projectId } = req.params
  // Retreive project
  const project = await documentClient.send(new GetCommand({
    TableName: 'projects',
    Key: { project_id: projectId }
  }))
  // Make sure there is a project
  if (!('Item' in project)) {
    return res.status(404).json({ message: 'The requested project does not exist' })
  }
  // Return project
  return res.json({ project: project.Item })
}

export const renameProject = async (req, res) => {
  const { projectId } = req.params
  const { name } = req.body
  // Update project
  try {
    const project = await documentClient.send(new UpdateCommand({
      TableName: 'projects',
      Key: {
        project_id: projectId
      },
      ConditionExpression: 'attribute_exists(project_id)',
      UpdateExpression: 'set #name = :name_value',
      ExpressionAttributeValues: { ':name_value': name },
      ExpressionAttributeNames: { '#name': 'name' },
      ReturnValues: 'ALL_NEW'
    }))
    // Return project
    return res.json({ message: 'Project updated', project: project.Attributes })
  } catch (err) {
    return res.status(404).json({ message: 'The requested project does not exist' })
  }
}

export const deleteProject = async (req, res) => {
  const { projectId } = req.params
  // Delete project
  await documentClient.send(new DeleteCommand({
    TableName: 'projects',
    Key: { project_id: projectId }
  }))
  // Return confirmation
  return res.json({ message: 'Project deleted' })
}