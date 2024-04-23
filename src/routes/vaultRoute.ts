import { Router, Response, Request, response } from "express";
import PrismaDB from "../factory/prismaClient";
import { PrismaClient } from "@prisma/client/extension";
import WordT from "../interfaces";

interface VaultT{
    vaultName: string,
    vaultDescription: string
    vaultIDs?: string[]
}

const db: PrismaClient = PrismaDB.getInstance();

const router = Router();

//CREATE VAULT
router.post("/vault", async(req: Request, res: Response) => {
    const vaultData: VaultT = req.body;
    try {
        const response = await db.vault.create({
            data: vaultData
        })
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
})

//GET ALL VAULTS
router.get("/vaults", async (req: Request, res: Response) => {
    try {
        const vaults: VaultT[] = await db.vault.findMany();
        res.send(vaults);
    }
    catch (e) {
        res.send(e);
    }
    
})

//ADD A WORD TO A VAULT
router.post("/vaults/:vaultId/word", async (req, res) => {
    const wordToBeSaved: WordT = req.body;
    const vaultId: string = req.params['vaultId'];
    const wordSavedInVault = await db.word.create({
        data: {
            ...wordToBeSaved,
            Vault: {
                create: {
                    vaultId: vaultId
                }
            }
        }
    });
    res.send(wordSavedInVault);
})




export default router;