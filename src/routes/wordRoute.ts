import { Router, Request, Response } from "express";
import PrismaDB from "../factory/prismaClient";
import { PrismaClient } from "@prisma/client/extension";
import getWordDefinition from "../helpers/WordHelper";
import WordT from "../interfaces";

const router = Router();
const db: PrismaClient = PrismaDB.getInstance();

//GET ALL THE DEFINITIONS FOR A WORD
router.get("/word-definitions/:word", async(req: Request, res: Response) => {
    const word: string = req.params['word'];
    const wordList: WordT[] = await getWordDefinition(word);
    res.send(wordList);
})



export default router;