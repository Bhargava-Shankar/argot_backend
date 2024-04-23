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

//ADD A WORD TO A VAULT 
router.post("/vaults/:vaultId/word", async (req, res) => {
  const wordToBeSaved: WordT = req.body;
  const vaultId: string = req.params['vaultId'];
  try {
    const wordSavedInVault = await db.word.upsert({
      where: {
        uniqueWordComb: {
          wordName: wordToBeSaved['wordName'],
          partOfSpeech: wordToBeSaved['partOfSpeech'],
          definition : wordToBeSaved['definition']
        }
      },
      update: {
          Vault: {
            create: {
              vaultId: vaultId
            }
          }
      },
      create: {
          ...wordToBeSaved,
          Vault: {
            create: {
              vaultId: vaultId
            }
          }
      }
    });
    res.send(wordSavedInVault);
  }
  catch (e) {
    res.send(e);
  }

})


//GET ALL WORDS INSIDE A VAULT
router.get("/vaults/:vaultID/words", async (req, res) => {
  try {
    const wordIdList: string[] = await db.VaultWords.findMany({
      where: {
        vaultId: req.params.vaultID
      }
    }).then((res: any) => {
      return res.map((item: any) => item['wordId']);
    });

    console.log(wordIdList);
    const wordList = await db.word.findMany({
      where: {
        id: {
          in: wordIdList
        }
      },
    })
  
    res.send(wordList);    
  }
  catch (e) {
    res.send(e);
  }
})

//UPDATE A WORD 
router.put("/words/:wordId", async(req, res) => {
  try {
    const wordData: WordT = req.body;
    const wordId = req.params.wordId;
    const updateResponse = await db.word.update({
      where: {
        id: wordId
      },
      data:  wordData
    })
    res.send(updateResponse);
  }
  catch (e) {
    res.send(e);
  }
})


export default router;