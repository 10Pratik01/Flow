import { Router } from "express";
import {getUsers} from "../controllers/userControllers.js"

const userRoutes = Router(); 

userRoutes.get("/everyone", getUsers);

export default userRoutes; 