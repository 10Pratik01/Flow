import { Router } from "express";
import { createTask, getTask, updateTaskStatus } from "../controllers/taskController.js";

const taskRouter = Router(); 

taskRouter.get("/", getTask)
taskRouter.post('/', createTask)
taskRouter.patch('/:taskId/status', updateTaskStatus)

export default taskRouter; 