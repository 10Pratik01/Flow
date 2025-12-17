import { Router } from "express";
import { getTeams } from "../controllers/teamController.js";

const teamRoutes = Router(); 

teamRoutes.get("/", getTeams);

export default teamRoutes; 