import express from "express"
import { createProject, deleteProject, getAllProjects, getProject, renameProject } from "../endpoints/projects.js"
import { verifyIntersection } from "../endpoints/intersection.js"
import { mergeProjects } from "../endpoints/merge.js"
import { nameAndPerimeterPresent, namePresent, twoProjectPresent, validPerimeter } from "../middleware/bodyVerification.js"

const router = express.Router()

router.get('/projects', getAllProjects)
router.post('/projects', nameAndPerimeterPresent, validPerimeter, createProject)
router.get('/projects/:projectId', getProject)
router.patch('/projects/:projectId', namePresent, renameProject)
router.delete('/projects/:projectId', deleteProject)

router.post('/project-intersection', twoProjectPresent, verifyIntersection)

router.post('/merge-projects', twoProjectPresent, mergeProjects)

export default router