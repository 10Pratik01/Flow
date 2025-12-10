import type { Request, Response } from "express";
import {prisma} from "../lib/prisma.js"

export const getProjects = async (
    req:Request, 
    res:Response
):Promise<void> => {
    try {
        const projects = await prisma.project.findMany(); 
        console.log(projects)
        res.json(projects)
    } catch (error) {
        res.status(500).json({message:"Error retrieving process"})
    }
}

export const createProject = async(
    req:Request, 
    res:Response
):Promise<void> => {
    try {
        const {name, description, startDate, endDate} = req.body; 
        
        const newProject = await prisma.project.create({
            data:{
                name, 
                description, 
                startDate, 
                endDate
            }
        })

        res.status(201).json({
            newProject,
            message:"Created project succesfully", 
        })

          
    } catch (err:any) {
        console.log(err.message)
        res.status(500).json({
            message:`Creating project failed. Please try again. ${err.message}`
        })
    }
} 

