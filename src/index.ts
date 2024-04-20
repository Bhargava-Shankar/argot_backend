import express, { Request, Response } from "express";
import router from "./routes/indexRoute";

const app = express();
const port = 5000;
app.use(express.json());
app.use("/api", router);
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});