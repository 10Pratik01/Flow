import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectControllers.js";

const router = Router(); 

router.get("/", getProjects);
router.post("/", createProject);  
export default router

