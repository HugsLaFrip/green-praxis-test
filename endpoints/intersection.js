// Post function to verify perimeter intersection
// Receive two ids in body
// Verify intersection of the two projects
// Return whether it has an intersection or not

import documentClient from "../database/connect.js"
import { BatchGetCommand } from "@aws-sdk/lib-dynamodb"
import { booleanIntersects } from "@turf/turf"

export const verifyIntersection = async (req, res) => {
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
  // Return whether they intersect or not
  return res.json({ intersection: booleanIntersects(projectOne.perimeter, projectTwo.perimeter) })
}