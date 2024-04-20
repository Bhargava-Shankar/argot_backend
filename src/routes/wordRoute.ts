import { Router, Request, Response } from "express";
import PrismaDB from "../factory/prismaClient";
import { PrismaClient } from "@prisma/client/extension";
import getWordDefinition from "../helpers/WordHelper";
import WordT from "../interfaces";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

/*
{
  "_id": {
    "$oid": "662359579a59c8984382470e"
  },
  "vaultName": "Favourites",
  "vaultDescription": "All your Favourite words stored here - Default Vault"
} 
*/

const router = Router();
const db: PrismaClient = PrismaDB.getInstance();

//GET ALL THE DEFINITIONS FOR A WORD
router.get("/word-definitions/:word", async(req: Request, res: Response) => {
    const word: string = req.params['word'];
    const wordList: WordT[] = await getWordDefinition(word);
    res.send(wordList);
})

//SAVE THE WORD TO FAVOURITES
router.post("/word/favourites", async(req, res) => {
    //GET THE ID OF FAVOURITES
    try {
        const favouriteVaultID = await db.vault.findUnique({
            where: {
                vaultName: "Favourites"
            },
            select: {
                id: true
            }
        });
        //GET THE WORD DATA FROM REQUEST
        const wordData: WordT = req.body;
        //FIND THE WORD AND UPDATE THE VAULT ID AS FAVOURITE
        const findAndUpdate = await db.word.upsert({
            where: {
                uniqueWordComb: {
                    wordName: wordData['wordName'],
                    partOfSpeech: wordData['partOfSpeech'],
                    definition: wordData['definition'],
                }
            },
            create: {
                ...wordData,
                vaultIDs : [favouriteVaultID['id']]
            },
            update: {
                vaultIDs: {
                    push: favouriteVaultID['id']
                }
            }
        })
        res.send(findAndUpdate);
        
    }
    catch (e: any) {
        res.send(e);
    }
})


export default router;