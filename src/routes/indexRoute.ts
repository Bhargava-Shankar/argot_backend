import { Router, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import vaultRouter from "./vaultRoute";
import wordRouter from "./wordRoute";
import PrismaDB from "../factory/prismaClient";

const router = Router();

router.use("", vaultRouter);
router.use("", wordRouter);

export default router;