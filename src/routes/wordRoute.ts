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
router.post("/word/", async(req, res) => {
    //GET THE ID OF FAVOURITES
  console.log(req.query);
  ////CLUMSY CODE
    const vaultNameParam = req.query['vaultNameParam'];
    //CHECK IF THE VAULT EXISTS 
    try {
        const favouriteVaultID = await db.vault.findUnique({
            where: {
                vaultName: vaultNameParam
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
      
      const wordID = findAndUpdate['id'];

      //ADD WORD ID TO RESPECTIVE VAULT IT IS STORED
      const findAndUpdateVault = await db.vault.update({
        where: {
          id: favouriteVaultID['id']
        },
        data: {
          wordIDs: {
            push: wordID
          }
        }
      })
        res.send(findAndUpdateVault);
        
    }
    catch (e: any) {
        res.send(e);
  }
  ////CLUMSY CODE ENDS
})


export default router;