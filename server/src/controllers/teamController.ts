import {prisma} from "../lib/prisma.js"; 
import type { Request, Response } from "express";


export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();
    const teamsWithUsernames = await Promise.all(
        teams.map(async (team: any) => {
            const productOwner = await prisma.user.findUnique({
                where: {userId: team.productOwnerUserId!}, 
                select: {username: true }
            }); 

            const projectManager = await prisma.user.findUnique({
                where:{userId: team.productManagerUserId!}, 
                select: {username: true}, 

            })
            return {
                ...team, 
                productOwnerUsername: productOwner?.username, 
                productManagerUsername: projectManager?.username

            }
        })
    )
    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};