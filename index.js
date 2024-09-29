import express from "express";
import dotenv from "dotenv";
import { bootstrap } from "./src/index.router.js";
import { connectDB } from "./DB/connection.js";

dotenv.config();
const app = express();
const port = process.env.PORT;


connectDB();
app.use(express.static('public'));
app.use('/.well-known', express.static('public/.well-known'));
bootstrap(app, express);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
