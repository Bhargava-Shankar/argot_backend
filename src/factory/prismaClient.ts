import { PrismaClient } from "@prisma/client";

class PrismaDB{
    private static instance: PrismaClient;

    static getInstance(): PrismaClient {
        if (!PrismaDB.instance) {
            const prisma = new PrismaClient();
            return prisma
        }
        return PrismaDB.instance
    }
    private PrismaDB() { };
}

export default PrismaDB;