// Post function to merge projects
// Receive two ids in body
// Merge perimeter of the two projects
// Create a new one

import { BatchGetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import documentClient from "../database/connect.js"
import { v4 as uuidV4 } from "uuid"
import { featureCollection } from "@turf/turf"

export const mergeProjects = async (req, res) => {
  const { firstProjectId, secondProjectId } = req.body
  // Retreive projects
  const projects = await documentClient.send(new BatchGetCommand({
    RequestItems: {
      projects: {
        Keys: [
          { project_id: firstProjectId },
          { project_id: secondProjectId }
        ]
      }
    }
  }))

  const [projectOne, projectTwo] = projects.Responses.projects
  // Check if both project exist
  if (projectOne === undefined || projectTwo === undefined) {
    return res.status(404).json({ message: 'One or more selected project does not exist' })
  }
  // merge projects
  const mergedProject = {
    project_id: uuidV4(),
    name: `merge of ${projectOne.name} and ${projectTwo.name}`,
    perimeter: featureCollection([projectOne.perimeter, projectTwo.perimeter])
  }
  // create new project
  await documentClient.send(new PutCommand({
    TableName: 'projects',
    Item: mergedProject
  }))
  // Return merged project
  return res.json({ message: 'Merge completed', project: mergedProject })
}