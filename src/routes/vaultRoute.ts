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

//UPDATE A VAULT
router.put("/vault/:vaultId", async (req, res) => {
    const vaultData: VaultT = req.body;
    try {
        const vaultResponse = await db.vault.update({
            where: {
                id : req.params['vaultId']
            },
            data: {
                ...vaultData
            }
        })
        
        res.send(vaultResponse);
    }
    catch (e) {
        res.send(e);
    }
})

//DELETE VAULT
router.delete("/vault/:vaultId", async (req, res) => {
    try{
        const vaultId = req.params.vaultId;
        const deleteResponse = await db.vault.delete({
            where: {
                id: vaultId
            }
        })
        res.send(deleteResponse);
    }
    catch (e) {
        res.send(e);
    }
})









export default router;