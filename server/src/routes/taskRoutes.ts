import { Router } from "express";
import { createTask, getTask, getUserTask, updateTaskStatus } from "../controllers/taskController.js";

const taskRouter = Router(); 

taskRouter.get("/", getTask)
taskRouter.post('/', createTask)
taskRouter.patch('/:taskId/status', updateTaskStatus)
taskRouter.get("/user/:userId", getUserTask)

export default taskRouter; 