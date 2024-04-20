import { Router, Response, Request, response } from "express";
import PrismaDB from "../factory/prismaClient";
import { PrismaClient } from "@prisma/client/extension";

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

router.get("/vaults", async (req: Request, res: Response) => {
    try {
        const vaults: VaultT[] = await db.vault.findMany();
        res.send(vaults);
    }
    catch (e) {
        res.send(e);
    }
    
})





export default router;